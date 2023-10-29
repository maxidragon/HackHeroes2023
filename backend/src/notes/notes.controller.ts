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

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('public')
  async getPublicNotes(
    @Query('category') category: string,
    @Query('search') search: string,
  ) {
    return await this.notesService.getPublicNotes(category, search);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('class')
  async getClassNotes(
    @GetUser() user: JwtAuthDto,
    @Query('category') category: string,
    @Query('search') search: string,
  ) {
    return await this.notesService.getClassNotes(user.userId, category, search);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async getUserNotes(
    @GetUser() user: JwtAuthDto,
    @Query('search') search: string,
    @Query('category') category: string,
  ) {
    return await this.notesService.getUserNotes(category, user.userId, search);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getNoteById(@GetUser() user: JwtAuthDto, @Param('id') id: number) {
    return await this.notesService.getNoteById(id, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createNote(@GetUser() user: JwtAuthDto, @Body() data: NoteDto) {
    return await this.notesService.createNote(data, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateNote(
    @GetUser() user: JwtAuthDto,
    @Param('id') id: number,
    @Body() data: NoteDto,
  ) {
    return await this.notesService.updateNote(id, data, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteNote(@GetUser() user: JwtAuthDto, @Param('id') id: number) {
    return await this.notesService.deleteNote(id, user.userId);
  }
}
