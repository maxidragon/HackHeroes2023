import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateFlashCardDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsInt()
  setId: number;
}
