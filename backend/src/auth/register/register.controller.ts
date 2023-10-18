import { Controller, Post, Body } from '@nestjs/common';
import { RegisterDto } from '../dto';
import { AuthService } from '../auth.service';

@Controller('auth/register')
export class RegisterController {
  constructor(private authService: AuthService) {}

  @Post()
  async register(@Body() dto: RegisterDto) {
    await this.authService.signup(dto);
    return { msg: 'Successfully registered a new account!', statusCode: 201 };
  }
}
