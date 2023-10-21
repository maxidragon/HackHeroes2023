import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

@Injectable()
export class UserService {
  constructor(private prisma: DbService) {}

  async getPublicInformation(id: number): Promise<object> {
    const userPublicInformation: any = await this.prisma.user.findUniqueOrThrow(
      {
        where: { id },
        select: {
          firstName: true,
          lastName: true,
          username: true,
          description: true,
        },
      },
    );

    return userPublicInformation;
  }

  async findUsersByUserName(name: string): Promise<object[]> {
    return this.prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: name,
            },
          },
          {
            firstName: {
              contains: name,
            },
          },
          {
            lastName: {
              contains: name,
            },
          },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
      },
    });
  }

  async deleteAccount(userId: number) {
    if (!userId) throw new Error('UserId required');
    await this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
