import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { JwtAuthDto } from 'src/auth/dto';
import { VulcanGuard } from './vulcan.guard';
import { VulcanService } from './vulcan.service';
import { GradesQueryDto } from './dto/gradesQuery.dto';
import { LessonsQueryDto } from './dto/lessonsQuery.dto';
import { VulcanDto } from './dto/vulcan.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('vulcan')
export class VulcanController {
  constructor(private readonly vulcanService: VulcanService) {}

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
    return this.vulcanService.getLessons(query.from, query.to, user.userId);
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
  @Get('messages-received')
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
    return this.vulcanService.getAttendance(user.userId, query.from, query.to);
  }

  @UseGuards(VulcanGuard)
  @Delete('remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeVulcanAccount(@GetUser() user: JwtAuthDto): Promise<void> {
    return this.vulcanService.deleteVulcanAccount(user.userId);
  }
  @Post('register')
  async register(
    @GetUser() user: JwtAuthDto,
    @Body() data: VulcanDto,
  ): Promise<object> {
    return this.vulcanService.register(data, user);
  }
}
