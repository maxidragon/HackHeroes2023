import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtAuthDto, LoginDto, RegisterDto } from './dto';
import { DbService } from '../db/db.service';
import { sha512 } from 'js-sha512';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DbService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: RegisterDto): Promise<object> {
    const isTaken = await this.isTaken(dto.username, dto.email);
    if (isTaken) throw new ForbiddenException('Username or email is taken!');

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: sha512(dto.password),
        email: dto.email,
      },
    });
    return { msg: 'Successfully registered a new account!' };
  }

  async login(dto: LoginDto): Promise<[string, string, object] | []> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { email: dto.email },
    });

    if (sha512(dto.password) === user.password) {
      return this.generateAuthCookie({
        userId: user.id,
      });
    }
    throw new ForbiddenException('Wrong credentials!');
  }

  async isTaken(username: string, email: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    return Boolean(user);
  }

  async generateAuthJwt(payload: JwtAuthDto): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async generateAuthCookie(
    payload: JwtAuthDto,
  ): Promise<[string, string, object]> {
    const jwt = await this.generateAuthJwt(payload);
    return [
      'jwt',
      jwt,
      {
        secure: true,
        sameSite: 'lax',
      },
    ];
  }

  async getUserPublicInfo(email: string): Promise<object> {
    const { prisma } = this;
    const userPublicInfo: any = await prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
      select: {
        id: true,
        username: true,
      },
    });
    return userPublicInfo;
  }
}
