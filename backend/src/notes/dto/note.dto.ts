import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsOptional()
  categoryId: number;
}
