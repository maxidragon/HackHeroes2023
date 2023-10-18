import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtAuthDto } from '../dto';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtAuthDto => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
