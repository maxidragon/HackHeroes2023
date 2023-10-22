import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFlashCardDto {
  @IsString()
  @IsNotEmpty()
  concept: string;

  @IsString()
  @IsNotEmpty()
  definition: string;

  @IsInt()
  @IsOptional()
  setId: number;
}
