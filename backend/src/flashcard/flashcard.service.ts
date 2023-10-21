import { DbService } from './../db/db.service';
import { HttpException, Injectable } from '@nestjs/common';
import { CreateFlashCardSetDto } from './dto/createFlashCardSet.dto';
import { CreateFlashCardDto } from './dto/createFlashCardDto';

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
    return this.prisma.flashCardSet.findUnique({
      where: { id: flashCardSetId },
    });
  }

  async createFlashCardSet(
    dto: CreateFlashCardSetDto,
    userId: number,
  ): Promise<object> {
    return this.prisma.flashCardSet.create({
      data: {
        title: dto.title,
        description: dto.description,
        publicity: dto.publicity,
        user: {
          connect: { id: userId },
        },
      },
    });
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
        question: dto.question,
        answer: dto.answer,
        set: {
          connect: { id: dto.setId },
        },
      },
    });
  }
}
