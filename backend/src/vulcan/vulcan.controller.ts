import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { JwtAuthDto } from 'src/auth/dto';
import { VulcanGuard } from './vulcan.guard';
import { VulcanService } from './vulcan.service';
import { GradesQueryDto } from './dto/gradesQuery.dto';
import { VulcanDto } from './dto/vulcan.dto';
import { LessonsQueryDto } from './dto/lessonsQuery.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@UseGuards(AuthGuard('jwt'))
@Controller('vulcan')
export class VulcanController {
  constructor(
    private readonly vulcanService: VulcanService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(VulcanGuard)
  @Get()
  async index(@GetUser() user: JwtAuthDto): Promise<object> {
    return this.vulcanService.indexPage(user.userId);
  }

  @UseGuards(VulcanGuard)
  @Get('grades')
  async getGrades(
    @Query() query: GradesQueryDto,
    @GetUser() user: JwtAuthDto,
  ): Promise<object> {
    return await this.vulcanService.getGrades(user.userId, query.last);
  }

  @UseGuards(VulcanGuard)
  @Get('lessons')
  async getLessons(
    @Query() query: LessonsQueryDto,
    @GetUser() user: JwtAuthDto,
  ) {
    return this.vulcanService.getLessons(query.day, user.userId);
  }

  @UseGuards(VulcanGuard)
  @Get('lucky-number')
  async getLuckyNumber(@GetUser() user: JwtAuthDto): Promise<object> {
    return this.vulcanService.getLuckyNumber(user.userId);
  }
  @UseGuards(VulcanGuard)
  @Get('student')
  async getStudent(@GetUser() user: JwtAuthDto): Promise<object> {
    return this.vulcanService.getStudent(user.userId);
  }
  @UseGuards(VulcanGuard)
  @Get('messages')
  async getReceivedMessages(@GetUser() user: JwtAuthDto): Promise<object> {
    return this.vulcanService.getMessages(user.userId);
  }

  @UseGuards(VulcanGuard)
  @Get('homework')
  async getHomework(@GetUser() user: JwtAuthDto) {
    return this.vulcanService.getHomework(user.userId);
  }

  @UseGuards(VulcanGuard)
  @Get('exams')
  async getExams(@GetUser() user: JwtAuthDto, @Query('last') last: number) {
    return this.vulcanService.getExams(user.userId, last);
  }

  @UseGuards(VulcanGuard)
  @Get('attendance')
  async getAttendance(
    @Query() query: LessonsQueryDto,
    @GetUser() user: JwtAuthDto,
  ) {
    return this.vulcanService.getAttendance(user.userId, query.day);
  }
  @UseGuards(VulcanGuard)
  @Delete('remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVulcanAccount(@GetUser() user: JwtAuthDto, @Res() res: Response) {
    await this.vulcanService.deleteVulcanAccount(user.userId);
    res.cookie(
      'user_info',
      JSON.stringify(await this.authService.getUserPublicInfoById(user.userId)),
      {
        domain: this.configService.get<string>(
          'COOKIE_DOMAIN',
          this.configService.get<string>('DOMAIN'),
        ),
        secure: true,
        sameSite: 'lax',
      },
    );
    res.send({ statusCode: 200, message: 'Succesfully removed vulcan' });
  }
  @Post('register')
  async register(
    @GetUser() user: JwtAuthDto,
    @Body() data: VulcanDto,
    @Res() res: Response,
  ) {
    await this.vulcanService.register(data, user);
    res.cookie(
      'user_info',
      JSON.stringify(await this.authService.getUserPublicInfoById(user.userId)),
      {
        domain: this.configService.get<string>(
          'COOKIE_DOMAIN',
          this.configService.get<string>('DOMAIN'),
        ),
        secure: true,
        sameSite: 'lax',
      },
    );
    res.send({ statusCode: 200, message: 'Succesfully added vulcan' });
  }

  @Get('active')
  async isActivated(@GetUser() user: JwtAuthDto): Promise<object> {
    return this.vulcanService.isActivated(user.userId);
  }
}
