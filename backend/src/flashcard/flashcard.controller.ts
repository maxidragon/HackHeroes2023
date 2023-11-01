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
import { FlashcardService } from './flashcard.service';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { JwtAuthDto } from 'src/auth/dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateFlashCardDto } from './dto/createFlashCard.dto';
import { CreateFlashCardSetDto } from './dto/createFlashCardSet.dto';
import { ForkFlashCardSetDto } from './dto/forkFlashCardSet.dto';
import { UpdateFlashCardSetDto } from './dto/updateFlashCardSet.dto';

@Controller('flashcard')
export class FlashcardController {
  constructor(private readonly flashcardService: FlashcardService) {}

  @Get('public')
  async getPublicFlashCardsSets(
    @Query('search') search: string,
  ): Promise<object> {
    return await this.flashcardService.getPublicFlashCardsSets(search);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async getMyFlashCardsSets(
    @GetUser() user: JwtAuthDto,
    @Query('search') search: string,
  ): Promise<object> {
    return await this.flashcardService.getMyFlashCardsSets(user.userId, search);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('class')
  async getMyClassFlashCardsSets(
    @GetUser() user: JwtAuthDto,
    @Query('search') search: string,
  ): Promise<object> {
    return await this.flashcardService.getMyClassFlashCardsSets(
      user.userId,
      search,
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('set/:id')
  async getFlashCardSet(
    @GetUser() user: JwtAuthDto,
    @Param('id') setId: number,
  ): Promise<object> {
    return await this.flashcardService.getFlashCardSet(setId, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('set')
  async createFlashCardSet(
    @Body() dto: CreateFlashCardSetDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return await this.flashcardService.createFlashCardSet(dto, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('set/:id')
  async updateFlashCardSet(
    @Body() dto: UpdateFlashCardSetDto,
    @GetUser() user: JwtAuthDto,
    @Param('id') id: number,
  ): Promise<object> {
    return await this.flashcardService.updateFlashCardSet(dto, id, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('set/:id')
  async deleteFlashCardSet(
    @GetUser() user: JwtAuthDto,
    @Param('id') id: number,
  ): Promise<object> {
    return await this.flashcardService.deleteFlashCardSet(id, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('set/fork')
  async forkFlashCardSet(
    @GetUser() user: JwtAuthDto,
    @Body() dto: ForkFlashCardSetDto,
  ): Promise<object> {
    return await this.flashcardService.forkFlashCardSet(dto, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/card')
  async createFlashCard(
    @Body() dto: CreateFlashCardDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return await this.flashcardService.createFlashCard(dto, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('card/many')
  async createFlashCards(
    @Body() dto: CreateFlashCardDto[],
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return await this.flashcardService.createManyFlashCards(dto, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('card/:id')
  async updateFlashCard(
    @Body() dto: CreateFlashCardDto,
    @GetUser() user: JwtAuthDto,
    @Param('id') id: number,
  ): Promise<object> {
    return await this.flashcardService.updateFlashCard(dto, id, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('card/:id')
  async deleteFlashCard(
    @GetUser() user: JwtAuthDto,
    @Param('id') id: number,
  ): Promise<object> {
    return await this.flashcardService.deleteFlashCard(id, user.userId);
  }
}
