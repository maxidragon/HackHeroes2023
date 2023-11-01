import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum Publicity {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  CLASS = 'CLASS',
}
export class UpdateFlashCardSetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(Publicity)
  publicity: Publicity;

  @IsNotEmpty()
  flashCards: FlashCard[];
}

interface FlashCard {
  id?: number;
  question: string;
  answer: string;
  isDelete?: boolean;
}
