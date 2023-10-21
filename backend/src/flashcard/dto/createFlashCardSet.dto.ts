import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum Publicity {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  CLASS = 'CLASS',
}
export class CreateFlashCardSetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(Publicity)
  publicity: Publicity;
}
