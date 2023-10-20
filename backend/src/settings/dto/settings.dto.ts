import { IsOptional, IsString } from 'class-validator';

export class SettingsDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsOptional()
  instagram?: string;

  @IsOptional()
  github?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
