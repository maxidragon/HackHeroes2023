import { Module } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { FlashcardController } from './flashcard.controller';

@Module({
  providers: [FlashcardService],
  controllers: [FlashcardController],
})
export class FlashcardModule {}
