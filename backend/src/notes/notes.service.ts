import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { NoteDto } from './dto/note.dto';
import { NoteCategoryDto } from './dto/noteCategory.dto';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: DbService) {}

  async getAllUserCategories(userId: number): Promise<object[]> {
    return this.prisma.noteCategory.findMany({
      where: { userId },
      select: { id: true, name: true },
    });
  }

  async getAllNotes(userId: number): Promise<object[]> {
    return this.prisma.note.findMany({
      where: { userId },
      select: { id: true, title: true, content: true },
    });
  }
  async getAllNotesFromCategory(
    userId: number,
    categoryId: number,
  ): Promise<object[]> {
    return this.prisma.note.findMany({
      where: { userId, categoryId },
      select: { id: true, title: true, content: true },
    });
  }

  async searchNotes(userId: number, search: string): Promise<object[]> {
    return this.prisma.note.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: search } },
          { content: { contains: search } },
        ],
      },
      select: { id: true, title: true, content: true },
    });
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

  async createNoteCategory(
    data: NoteCategoryDto,
    userId: number,
  ): Promise<object | null> {
    return this.prisma.noteCategory.create({
      data: { ...data, userId },
      select: { id: true, name: true },
    });
  }

  async updateNoteCategory(
    id: number,
    data: NoteCategoryDto,
    userId: number,
  ): Promise<object | null> {
    return this.prisma.noteCategory.updateMany({
      where: { id, userId },
      data,
    });
  }

  async deleteNoteCategory(id: number, userId: number): Promise<object | null> {
    return this.prisma.noteCategory.deleteMany({
      where: { id, userId },
    });
  }
}
