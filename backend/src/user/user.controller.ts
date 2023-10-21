import {
  Controller,
  Param,
  Get,
  Query,
  ParseIntPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
@UseGuards(AuthGuard('jwt'))
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findUsersByName(@Query('name') name: string): Promise<object[]> {
    if (name) return this.userService.findUsersByUserName(name);
    return [];
  }

  @Get('/:userId')
  async getPublicInformation(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.getPublicInformation(userId);
  }

  @Delete()
  async deleteAccount(@GetUser() user: JwtAuthDto) {
    await this.userService.deleteAccount(user.userId);
    return { message: 'Account deleted', statusCode: 200 };
  }
}
