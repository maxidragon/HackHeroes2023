import { DbService } from './../db/db.service';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateFlashCardSetDto } from './dto/createFlashCardSet.dto';
import { CreateFlashCardDto } from './dto/createFlashCard.dto';
import { UpdateFlashCardSetDto } from './dto/updateFlashCardSet.dto';

@Injectable()
export class FlashcardService {
  constructor(private readonly prisma: DbService) {}

  async getPublicFlashCardsSets(search: string): Promise<object> {
    const whereParams = {
      publicity: 'PUBLIC' as any,
    };
    if (search) {
      Object.assign(whereParams, {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      });
    }
    return this.prisma.flashCardSet.findMany({
      where: whereParams,
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async getMyFlashCardsSets(userId: number, search: string): Promise<object> {
    const whereParams = {
      userId: userId,
      publicity: 'PRIVATE' as any,
    };

    if (search) {
      Object.assign(whereParams, {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      });
    }

    return this.prisma.flashCardSet.findMany({
      where: whereParams,
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async getMyClassFlashCardsSets(
    userId: number,
    search: string,
  ): Promise<object> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        schoolClass: true,
        schoolName: true,
      },
    });
    const whereParams = {
      user: {
        schoolClass: user.schoolClass,
        schoolName: user.schoolName,
      },
      publicity: 'CLASS' as any,
    };
    if (search) {
      Object.assign(whereParams, {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      });
    }
    return this.prisma.flashCardSet.findMany({
      where: whereParams,
    });
  }

  async getFlashCardSet(
    flashCardSetId: number,
    userId: number,
  ): Promise<object> {
    if (!(await this.hasSetPermission(flashCardSetId, userId))) {
      throw new HttpException(
        'You do not have access to this flashcard set!',
        403,
      );
    }
    const set = await this.prisma.flashCardSet.findUnique({
      where: {
        id: flashCardSetId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        publicity: true,
        forkedFrom: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    const flashCards = await this.prisma.flashCard.findMany({
      where: {
        setId: flashCardSetId,
      },
      select: {
        id: true,
        question: true,
        answer: true,
      },
    });

    return {
      ...set,
      flashCards: flashCards,
    };
  }

  async createFlashCardSet(
    dto: CreateFlashCardSetDto,
    userId: number,
  ): Promise<object> {
    const flashCardSet = await this.prisma.flashCardSet.create({
      data: {
        title: dto.title,
        description: dto.description,
        publicity: dto.publicity,
        user: {
          connect: { id: userId },
        },
      },
    });

    const flashCards = dto.flashCards.map((card) => {
      return {
        setId: flashCardSet.id,
        concept: card.concept,
        definition: card.definition,
      };
    });

    await this.createManyFlashCards(flashCards, userId);

    return { id: flashCardSet.id };
  }

  async createFlashCard(
    dto: CreateFlashCardDto,
    userId: number,
  ): Promise<object> {
    const flashCardSet = await this.prisma.flashCardSet.findUnique({
      where: { id: dto.setId },
    });

    if (flashCardSet.userId !== userId) {
      throw new HttpException(
        'You are not the owner of this flashcard set!',
        403,
      );
    }
    return this.prisma.flashCard.create({
      data: {
        question: dto.concept,
        answer: dto.definition,
        set: {
          connect: { id: dto.setId },
        },
      },
    });
  }

  async createManyFlashCards(
    dto: CreateFlashCardDto[],
    userId: number,
  ): Promise<object> {
    const flashCardSet = await this.prisma.flashCardSet.findUnique({
      where: { id: dto[0].setId },
    });

    if (flashCardSet.userId !== userId) {
      throw new HttpException(
        'You are not the owner of this flashcard set!',
        403,
      );
    }
    return this.prisma.flashCard.createMany({
      data: dto.map((card) => {
        return {
          question: card.concept,
          answer: card.definition,
          setId: card.setId,
        };
      }),
    });
  }

  async updateFlashCardSet(
    dto: UpdateFlashCardSetDto,
    setId: number,
    userId: number,
  ): Promise<object> {
    const flashCardSet = await this.prisma.flashCardSet.findUnique({
      where: { id: setId },
    });

    if (flashCardSet.userId !== userId) {
      throw new HttpException(
        'You are not the owner of this flashcard set!',
        403,
      );
    }
    for (const card of dto.flashCards) {
      if (card.id) {
        if (card.isDelete) {
          await this.prisma.flashCard.delete({
            where: { id: card.id },
          });
          continue;
        } else {
          await this.prisma.flashCard.update({
            where: { id: card.id },
            data: {
              question: card.question,
              answer: card.answer,
            },
          });
        }
      } else {
        await this.prisma.flashCard.create({
          data: {
            question: card.question,
            answer: card.answer,
            set: {
              connect: { id: setId },
            },
          },
        });
      }
    }
    return this.prisma.flashCardSet.update({
      where: { id: setId },
      data: {
        title: dto.title,
        description: dto.description,
        publicity: dto.publicity,
      },
    });
  }

  async deleteFlashCardSet(setId: number, userId: number): Promise<object> {
    const flashCardSet = await this.prisma.flashCardSet.findUnique({
      where: { id: setId },
    });

    if (flashCardSet.userId !== userId) {
      throw new HttpException(
        'You are not the owner of this flashcard set!',
        403,
      );
    }
    return this.prisma.flashCardSet.delete({
      where: { id: setId },
    });
  }

  async forkFlashCardSet(setId: number, userId: number): Promise<object> {
    const flashCardSet = await this.prisma.flashCardSet.findUnique({
      where: { id: setId },
      select: {
        title: true,
        description: true,
        publicity: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    await this.prisma.flashCardSet.create({
      data: {
        title: `${flashCardSet.title} (copy)`,
        description: flashCardSet.description,
        publicity: flashCardSet.publicity,
        forkedFrom: `${flashCardSet.user.username}/${flashCardSet.title}`,
        user: {
          connect: { id: userId },
        },
      },
    });

    const flashCards = await this.prisma.flashCard.findMany({
      where: { setId: setId },
    });

    await this.prisma.flashCard.createMany({
      data: flashCards.map((card) => {
        return {
          question: card.question,
          answer: card.answer,
          setId: card.setId,
        };
      }),
    });
    return { message: 'Flashcard set forked successfully!' };
  }

  async updateFlashCard(
    dto: CreateFlashCardDto,
    cardId: number,
    userId: number,
  ): Promise<object> {
    const flashCard = await this.prisma.flashCard.findUnique({
      where: { id: cardId },
      include: {
        set: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (flashCard.set.userId !== userId) {
      throw new HttpException(
        'You are not the owner of this flashcard set!',
        403,
      );
    }
    return this.prisma.flashCard.update({
      where: { id: cardId },
      data: {
        question: dto.concept,
        answer: dto.definition,
      },
    });
  }

  async deleteFlashCard(cardId: number, userId: number): Promise<object> {
    const flashCard = await this.prisma.flashCard.findUnique({
      where: { id: cardId },
      include: {
        set: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (flashCard.set.userId !== userId) {
      throw new HttpException(
        'You are not the owner of this flashcard set!',
        403,
      );
    }
    return this.prisma.flashCard.delete({
      where: { id: cardId },
    });
  }

  async searchFlashCards(search: string, userId: number): Promise<object> {
    return this.prisma.flashCard.findMany({
      where: {
        set: {
          user: {
            id: userId,
          },
        },
        OR: [
          { question: { contains: search } },
          { answer: { contains: search } },
        ],
      },
    });
  }

  private async hasSetPermission(setId: number, userId: number) {
    const flashCardSet = await this.prisma.flashCardSet.findUnique({
      where: { id: setId },
      include: {
        user: {
          select: {
            id: true,
            schoolClass: true,
            schoolName: true,
          },
        },
      },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        schoolClass: true,
        schoolName: true,
      },
    });
    if (
      flashCardSet.userId !== userId &&
      flashCardSet.publicity === 'PRIVATE'
    ) {
      return false;
    } else if (
      flashCardSet.publicity === 'CLASS' &&
      flashCardSet.user.schoolClass !== user.schoolClass &&
      flashCardSet.user.schoolName !== user.schoolName
    ) {
      return false;
    }
    return true;
  }
}
