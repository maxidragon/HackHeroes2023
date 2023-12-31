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
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return await this.notesService.getPublicNotes(
      category,
      search,
      0,
      skip,
      take,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('public/auth')
  async getPublicNotesAsLoggedUser(
    @GetUser() user: JwtAuthDto,
    @Query('category') category: string,
    @Query('search') search: string,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return await this.notesService.getPublicNotes(
      category,
      search,
      user.userId,
      skip,
      take,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('class')
  async getClassNotes(
    @GetUser() user: JwtAuthDto,
    @Query('category') category: string,
    @Query('search') search: string,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return await this.notesService.getClassNotes(
      user.userId,
      category,
      search,
      skip,
      take,
    );
  }

  @Get('user/:userId')
  async getUserNotes(
    @Param('userId') userId: number,
    @Query('search') search: string,
    @Query('category') category: string,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return await this.notesService.getUserNotes(
      category,
      userId,
      search,
      skip,
      take,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('private/:userId')
  async getPrivateUserNotes(
    @GetUser() user: JwtAuthDto,
    @Query('search') search: string,
    @Query('category') category: string,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return await this.notesService.getPrivateUserNotes(
      category,
      user.userId,
      search,
      skip,
      take,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/like')
  async likeNote(@GetUser() user: JwtAuthDto, @Param('id') id: number) {
    return await this.notesService.likeNote(id, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/unlike')
  async unlikeNote(@GetUser() user: JwtAuthDto, @Param('id') id: number) {
    return await this.notesService.unlikeNote(id, user.userId);
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
