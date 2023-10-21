import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { JwtAuthDto } from 'src/auth/dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateFlashCardDto } from './dto/createFlashCardDto';
import { CreateFlashCardSetDto } from './dto/createFlashCardSet.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('flashcard')
export class FlashcardController {
  constructor(private readonly flashcardService: FlashcardService) {}
  @Get('/my')
  async getMyFlashCardsSets(@GetUser() user: JwtAuthDto): Promise<object> {
    return await this.flashcardService.getMyFlashCardsSets(user.userId);
  }

  @Get('/class')
  async getMyClassFlashCardsSets(@GetUser() user: JwtAuthDto): Promise<object> {
    return await this.flashcardService.getMyClassFlashCardsSets(user.userId);
  }

  @Get('/set/:id')
  async getFlashCardSet(@GetUser() user: JwtAuthDto): Promise<object> {
    return await this.flashcardService.getFlashCardSet(user.userId);
  }

  @Post('/set')
  async createFlashCardSet(
    @Body() dto: CreateFlashCardSetDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return await this.flashcardService.createFlashCardSet(dto, user.userId);
  }

  @Post('/card')
  async createFlashCard(
    @Body() dto: CreateFlashCardDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return await this.flashcardService.createFlashCard(dto, user.userId);
  }
}
