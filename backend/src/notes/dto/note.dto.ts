import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

enum Publicity {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  CLASS = 'CLASS',
}

enum Category {
  MATH = 'MATH',
  ENGLISH = 'ENGLISH',
  GERMAN = 'GERMAN',
  FRENCH = 'FRENCH',
  BIOLOGY = 'BIOLOGY',
  CHEMISTRY = 'CHEMISTRY',
  PHYSICS = 'PHYSICS',
  HISTORY = 'HISTORY',
  GEOGRAPHY = 'GEOGRAPHY',
  POLITICS = 'POLITICS',
  ECONOMICS = 'ECONOMICS',
  PHILOSOPHY = 'PHILOSOPHY',
  RELIGION = 'RELIGION',
  SPORT = 'SPORT',
  MUSIC = 'MUSIC',
  ART = 'ART',
  COMPUTER_SCIENCE = 'COMPUTER_SCIENCE',
  OTHER = 'OTHER',
}

export class NoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(Publicity)
  publicity: Publicity;

  @IsEnum(Category)
  category: Category;

  @IsOptional()
  @IsBoolean()
  isMd: boolean;
}
