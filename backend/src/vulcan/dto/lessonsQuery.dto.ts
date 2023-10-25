import { IsDate } from 'class-validator';

export class LessonsQueryDto {
  @IsDate()
  day: Date;
}
