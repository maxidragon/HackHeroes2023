import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  UseInterceptors,
  Res,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SettingsService } from './settings.service';
import { GetUser } from '../../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../../auth/dto/jwt-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { SettingsDto } from './dto/settings.dto';
import { Response } from 'express';
import { fileFilter } from './fileFilter';

@Controller('user/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
      ],
      { fileFilter: fileFilter },
    ),
  )
  @UseGuards(AuthGuard('jwt'))
  async updateSettings(
    @Body() settings: SettingsDto,
    @GetUser() user: JwtAuthDto,
    @UploadedFiles()
    files: { avatar: Express.Multer.File[]; banner: Express.Multer.File[] },
  ): Promise<void> {
    await this.settingsService.updateSettings(
      user.userId,
      settings,
      files?.banner ? files.banner[0] : null,
      files?.avatar ? files.avatar[0] : null,
    );
  }

  @Get('get')
  @UseGuards(AuthGuard('jwt'))
  async getSettings(@GetUser() user: JwtAuthDto): Promise<object> {
    return await this.settingsService.getSettings(user.userId);
  }

  @Get('avatar/:id')
  async getAvatar(
    @Param('id', ParseIntPipe) userId: number,
    @Res() response: Response,
  ): Promise<void> {
    response.setHeader('Content-Type', 'image/jpeg');
    const image = await this.settingsService.getAvatar(userId);

    if (!image) {
      response.status(HttpStatus.NO_CONTENT);
      response.send();
      return;
    }
    response.send(image);
  }

  @Get('banner/:id')
  async getBanner(
    @Param('id', ParseIntPipe) userId: number,
    @Res() response: Response,
  ): Promise<void> {
    response.setHeader('Content-Type', 'image/jpeg');
    const image = await this.settingsService.getBanner(userId);

    if (!image) {
      response.status(HttpStatus.NO_CONTENT);
      response.send();
      return;
    }
    response.send(image);
  }
}
