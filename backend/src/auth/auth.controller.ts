import { Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { IsTakenDto } from './dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('isTaken')
  async isTaken(dto: IsTakenDto): Promise<boolean> {
    return this.authService.isTaken(dto.username, dto.email);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt', {
      domain: this.configService.get<string>('DOMAIN'),
    });
    res.clearCookie('user_info', {
      domain: this.configService.get<string>('DOMAIN'),
    });
    res.send({ statusCode: true, message: 'Succesfully logged out' });
  }
}
