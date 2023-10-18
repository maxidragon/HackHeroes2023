import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TodoService } from './todo.service';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { JwtAuthDto } from 'src/auth/dto';
import { CreateTodoDto } from './dto/createTodo.dto';
import { UpdateTodoDto } from './dto/updateTodo.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('')
  async getAllTodos(@GetUser() user: JwtAuthDto) {
    return await this.todoService.getAllTodos(user.userId);
  }

  @Get(':id')
  async getTodoById(@Param('id') id: number) {
    return await this.todoService.getTodoById(id);
  }

  @Post('')
  async createTodo(@Body() data: CreateTodoDto, @GetUser() user: JwtAuthDto) {
    return await this.todoService.createTodo(data, user.userId);
  }

  @Put(':id')
  async updateTodoById(
    @Param('id') id: number,
    @Body() data: UpdateTodoDto,
    @GetUser() user: JwtAuthDto,
  ) {
    return await this.todoService.updateTodoById(id, data, user.userId);
  }

  @Delete(':id')
  async deleteTodoById(@Param('id') id: number, @GetUser() user: JwtAuthDto) {
    return await this.todoService.deleteTodoById(id, user.userId);
  }
}
