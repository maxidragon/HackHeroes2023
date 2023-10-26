import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtAuthDto, LoginDto, RegisterDto } from './dto';
import { DbService } from '../db/db.service';
import { sha512 } from 'js-sha512';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DbService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
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
    const jwt = await this.generateAuthJwt(payload as JwtAuthDto);
    return [
      'jwt',
      jwt,
      {
        domain: this.configService.get<string>(
          'COOKIE_DOMAIN',
          this.configService.get<string>('DOMAIN'),
        ),
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
        loginID: true,
      },
    });
    const data = {
      id: userPublicInfo.id,
      username: userPublicInfo.username,
      isVulcanEnabled: userPublicInfo.loginID ? true : false,
    };
    return data;
  }
  async sendResetEmail(email: string): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const emailContent = `
      <html lang="en">
        <body>
          <h1>Click the link below to reset your password</h1> 
          <a href="${frontendUrl}/password/reset/${sha512(
      String(user.id),
    )}">Reset password</a>
        </body>
      </html>
    `;
    const passwordResetRequest =
      await this.prisma.passwordResetRequest.findUnique({
        where: {
          userId: user.id,
        },
      });
    if (!passwordResetRequest) {
      await this.prisma.passwordResetRequest.create({
        data: {
          userId: user.id,
          hash: sha512(String(user.id)),
        },
      });
    }
    this.mailerService.sendMail({
      to: email,
      from: process.env.SMTP_USER,
      subject: 'Password reset request',
      html: emailContent,
    });
  }

  async resetPassword(userHash: string, newPassword: string): Promise<void> {
    const resetRequest =
      await this.prisma.passwordResetRequest.findUniqueOrThrow({
        where: {
          hash: userHash,
        },
      });
    await this.prisma.user.update({
      where: {
        id: resetRequest.userId,
      },
      data: {
        password: sha512(newPassword),
      },
    });
  }
}
