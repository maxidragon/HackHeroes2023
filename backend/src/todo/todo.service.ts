import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateTodoDto } from './dto/createTodo.dto';
import { UpdateTodoDto } from './dto/updateTodo.dto';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: DbService) {}

  async getAllUserTodos(
    userId: number,
    search: string,
    isDone: boolean,
    skip = 0,
    take = 10,
  ) {
    const whereParams = {
      userId: userId,
    };
    if (isDone) {
      Object.assign(whereParams, {
        done: isDone,
      });
    } else {
      Object.assign(whereParams, {
        done: false,
      });
    }
    if (search) {
      Object.assign(whereParams, {
        text: {
          contains: search,
        },
      });
    }
    const data = await this.prisma.todo.findMany({
      where: whereParams,
      skip: skip ? skip : 0,
      take: take ? take : 10,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const count = await this.prisma.todo.count({
      where: whereParams,
    });

    return {
      todos: data,
      count: count,
    };
  }

  async getTodoById(id: number) {
    return await this.prisma.todo.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createTodo(data: CreateTodoDto, userId: number) {
    return await this.prisma.todo.create({
      data: {
        text: data.text,
        userId: userId,
      },
    });
  }

  async updateTodoById(id: number, data: UpdateTodoDto, userId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id: id,
      },
    });
    if (todo.userId !== userId) {
      throw new Error('You are not authorized to edit this todo');
    }
    return await this.prisma.todo.update({
      where: {
        id: id,
      },
      data: {
        text: data.text,
        done: data.done,
      },
    });
  }

  async completeTodoById(id: number, userId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id: id,
      },
    });
    if (todo.userId !== userId) {
      throw new Error('You are not authorized to edit this todo');
    }
    return await this.prisma.todo.update({
      where: {
        id: id,
      },
      data: {
        done: true,
      },
    });
  }

  async deleteTodoById(id: number, userId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id: id,
      },
    });
    if (todo.userId !== userId) {
      throw new Error('You are not authorized to delete this todo');
    }
    return await this.prisma.todo.delete({
      where: {
        id: id,
      },
    });
  }

  async completeTodo(id: number, userId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id: id,
      },
    });
    if (todo.userId !== userId) {
      throw new Error('You are not authorized to edit this todo');
    }
    return await this.prisma.todo.update({
      where: {
        id: id,
      },
      data: {
        done: true,
      },
    });
  }
}
