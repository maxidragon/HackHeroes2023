import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { JwtAuthDto } from 'src/auth/dto';
import { NotesService } from './notes.service';
import { NoteDto } from './dto/note.dto';
import { NoteCategoryDto } from './dto/noteCategory.dto';
@UseGuards(AuthGuard('jwt'))
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}
  @Get()
  async getNotes(
    @GetUser() user: JwtAuthDto,
    @Query('categoryId') categoryId: number,
    @Query('search') search: string,
  ) {
    if (categoryId) {
      return await this.notesService.getAllNotesFromCategory(
        user.userId,
        categoryId,
      );
    }
    if (search) {
      return await this.notesService.searchNotes(user.userId, search);
    }
    return await this.notesService.getAllNotes(user.userId);
  }

  @Post()
  async createNote(@GetUser() user: JwtAuthDto, @Body() data: NoteDto) {
    return await this.notesService.createNote(data, user.userId);
  }

  @Put(':id')
  async updateNote(
    @GetUser() user: JwtAuthDto,
    @Param('id') id: number,
    @Body() data: NoteDto,
  ) {
    return await this.notesService.updateNote(id, data, user.userId);
  }

  @Delete(':id')
  async deleteNote(@GetUser() user: JwtAuthDto, @Param('id') id: number) {
    return await this.notesService.deleteNote(id, user.userId);
  }

  @Get('categories')
  async getCategories(@GetUser() user: JwtAuthDto) {
    return await this.notesService.getAllUserCategories(user.userId);
  }

  @Post('categories')
  async createCategory(
    @GetUser() user: JwtAuthDto,
    @Body() data: NoteCategoryDto,
  ) {
    return await this.notesService.createNoteCategory(data, user.userId);
  }

  @Put('categories/:id')
  async updateCategory(
    @GetUser() user: JwtAuthDto,
    @Param('id') id: number,
    @Body() data: NoteCategoryDto,
  ) {
    return await this.notesService.updateNoteCategory(id, data, user.userId);
  }

  @Delete('categories/:id')
  async deleteCategory(@GetUser() user: JwtAuthDto, @Param('id') id: number) {
    return await this.notesService.deleteNoteCategory(id, user.userId);
  }
}
