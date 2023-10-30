import { HttpException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { NoteDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: DbService) {}

  async getPublicNotes(
    category: string,
    search: string,
    userId: number,
    skip = 0,
    take = 5,
  ) {
    const whereParams = {
      publicity: 'PUBLIC' as any,
    };

    if (category && category !== 'ALL')
      Object.assign(whereParams, { category: category });
    if (search && search !== '') {
      Object.assign(whereParams, {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      });
    }

    const data = await this.prisma.note.findMany({
      where: whereParams,
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        createdAt: true,
        user: {
          select: { id: true, username: true },
        },
      },
      skip: skip ? skip : 0,
      take: take ? take : 5,
      orderBy: {
        NoteLike: {
          _count: 'desc',
        },
      },
    });

    const count = await this.prisma.note.count({
      where: whereParams,
    });

    const dataToReturn = [];
    for (const note of data) {
      if (userId !== 0) {
        const likesCount = await this.prisma.noteLike.count({
          where: { noteId: note.id },
        });
        const isUserLiked = await this.prisma.noteLike.findFirst({
          where: { noteId: note.id, userId: userId },
        });
        dataToReturn.push({ ...note, likesCount, isLiked: !!isUserLiked });
      } else {
        const likesCount = await this.prisma.noteLike.count({
          where: { noteId: note.id },
        });
        dataToReturn.push({ ...note, likesCount, isLiked: false });
      }
    }

    return { data: dataToReturn, count };
  }

  async getClassNotes(
    userId: number,
    category: string,
    search: string,
    skip = 0,
    take = 5,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, schoolClass: true, schoolName: true },
    });
    const whereParams = {
      publicity: 'CLASS' as any,
      user: {
        schoolName: user.schoolName,
        schoolClass: user.schoolClass,
      },
    };
    if (category && category !== 'ALL')
      Object.assign(whereParams, { category: category });
    if (search && search !== '') {
      Object.assign(whereParams, {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      });
    }

    const data = await this.prisma.note.findMany({
      where: whereParams,
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        isMd: true,
        user: {
          select: { id: true, username: true },
        },
      },
      orderBy: {
        NoteLike: {
          _count: 'desc',
        },
      },
      skip: skip ? skip : 0,
      take: take ? take : 5,
    });

    const count = await this.prisma.note.count({
      where: whereParams,
    });

    const dataToReturn = [];
    for (const note of data) {
      const likesCount = await this.prisma.noteLike.count({
        where: { noteId: note.id },
      });
      const isUserLiked = await this.prisma.noteLike.findFirst({
        where: { noteId: note.id, userId: userId },
      });
      dataToReturn.push({ ...note, likesCount, isLiked: !!isUserLiked });
    }

    return { data: dataToReturn, count };
  }

  async getUserNotes(
    category: string,
    userId: number,
    search: string,
    skip = 0,
    take = 5,
  ) {
    const whereParams = {
      userId: userId,
    };
    if (category && category !== 'ALL')
      Object.assign(whereParams, { category: category });
    if (search && search !== '') {
      Object.assign(whereParams, {
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      });
    }
    const data = await this.prisma.note.findMany({
      where: whereParams,
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        isMd: true,
        user: {
          select: { id: true, username: true },
        },
      },
      orderBy: {
        NoteLike: {
          _count: 'desc',
        },
      },
      skip: skip ? skip : 0,
      take: take ? take : 5,
    });
    const count = await this.prisma.note.count({
      where: whereParams,
    });

    const dataToReturn = [];
    for (const note of data) {
      const likesCount = await this.prisma.noteLike.count({
        where: { noteId: note.id },
      });
      const isUserLiked = await this.prisma.noteLike.findFirst({
        where: { noteId: note.id, userId: userId },
      });
      dataToReturn.push({ ...note, likesCount, isLiked: !!isUserLiked });
    }

    return { data: dataToReturn, count };
  }

  async getNoteById(id: number, userId: number) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        isMd: true,
        publicity: true,
        user: {
          select: { id: true, username: true },
        },
      },
    });

    if (!note) throw new HttpException('Not found', 404);

    const likesCount = await this.prisma.noteLike.count({
      where: { noteId: note.id },
    });

    const isUserLiked = await this.prisma.noteLike.findFirst({
      where: { noteId: note.id, userId: userId },
    });

    return note.user.id === userId
      ? { ...note, likesCount, isUserLiked: !!isUserLiked }
      : new HttpException('Forbidden', 403);
  }

  async createNote(data: NoteDto, userId: number): Promise<object | null> {
    return this.prisma.note.create({
      data: { ...data, userId },
      select: { id: true, title: true, content: true },
    });
  }

  async updateNote(
    id: number,
    data: NoteDto,
    userId: number,
  ): Promise<object | null> {
    return this.prisma.note.updateMany({
      where: { id, userId },
      data,
    });
  }

  async deleteNote(id: number, userId: number): Promise<object | null> {
    return this.prisma.note.deleteMany({
      where: { id, userId },
    });
  }

  async likeNote(noteId: number, userId: number) {
    try {
      await this.prisma.noteLike.create({
        data: {
          noteId,
          userId,
        },
      });
    } catch (err) {
      throw new HttpException('Already liked', 409);
    }
  }

  async unlikeNote(noteId: number, userId: number) {
    return this.prisma.noteLike.deleteMany({
      where: {
        noteId,
        userId,
      },
    });
  }
}
