import { DbService } from './../db/db.service';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateFlashCardSetDto } from './dto/createFlashCardSet.dto';
import { CreateFlashCardDto } from './dto/createFlashCard.dto';
import { ForkFlashCardSetDto } from './dto/forkFlashCardSet.dto';

@Injectable()
export class FlashcardService {
  constructor(private readonly prisma: DbService) {}

  async getMyFlashCardsSets(userId: number): Promise<object> {
    return this.prisma.flashCardSet.findMany({
      where: { userId: userId },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async getMyClassFlashCardsSets(userId: number): Promise<object> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        schoolClass: true,
      },
    });
    return this.prisma.flashCardSet.findMany({
      where: {
        user: {
          schoolClass: user.schoolClass,
        },
      },
    });
  }

  async getFlashCardSet(flashCardSetId: number): Promise<object> {
    let set = await this.prisma.flashCardSet.findUnique({
      where: {
        id: flashCardSetId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return [set].map((set) => {
      delete set.userId;
      return set;
    })[0];
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
    dto: CreateFlashCardSetDto,
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

  async forkFlashCardSet(
    data: ForkFlashCardSetDto,
    userId: number,
  ): Promise<object> {
    const flashCardSet = await this.prisma.flashCardSet.findUnique({
      where: { id: data.setId },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    await this.prisma.flashCardSet.create({
      data: {
        title: data.title,
        description: data.description,
        publicity: data.publicity,
        forkedFrom: `${flashCardSet.title} by ${flashCardSet.user.username}`,
        user: {
          connect: { id: userId },
        },
      },
    });

    const flashCards = await this.prisma.flashCard.findMany({
      where: { setId: data.setId },
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
}
