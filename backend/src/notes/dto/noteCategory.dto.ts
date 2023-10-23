import { IsNotEmpty, IsString } from 'class-validator';

export class NoteCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
