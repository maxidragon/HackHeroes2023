import { HttpException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { NoteDto } from './dto/note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: DbService) {}

  async getPublicNotes(category: string, search: string): Promise<object[]> {
    if (search) {
      return this.prisma.note.findMany({
        where: {
          publicity: 'PUBLIC',
          category: category as any,
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        },
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
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prisma.note.findMany({
      where: {
        publicity: 'PUBLIC',
        category: category as any,
      },
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async getClassNotes(
    userId: number,
    category: string,
    search: string,
  ): Promise<object[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, schoolClass: true, schoolName: true },
    });
    if (search) {
      return this.prisma.note.findMany({
        where: {
          publicity: 'CLASS',
          category: category as any,
          user: {
            schoolName: user.schoolName,
            schoolClass: user.schoolClass,
          },
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        },
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
      });
    }

    return this.prisma.note.findMany({
      where: {
        publicity: 'CLASS',
        category: category as any,
        user: {
          schoolName: user.schoolName,
          schoolClass: user.schoolClass,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        user: {
          select: { id: true, username: true },
        },
      },
    });
  }

  async getUserNotes(category: string, userId: number, search: string) {
    if (search) {
      return this.prisma.note.findMany({
        where: {
          category: category as any,
          userId,
          OR: [
            { title: { contains: search } },
            { content: { contains: search } },
          ],
        },
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
      });
    }
    return this.prisma.note.findMany({
      where: {
        category: category as any,
        userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        user: {
          select: { id: true, username: true },
        },
      },
    });
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

    return note.user.id === userId ? note : new HttpException('Forbidden', 403);
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
}
