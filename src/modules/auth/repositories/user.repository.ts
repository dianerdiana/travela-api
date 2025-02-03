import { PrismaService } from '@lib/prisma.service';
import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: RegisterDto & { avatarId: string }) {
    return await this.prismaService.user.create({
      data: {
        avatar: data.avatar,
        avatarId: data.avatarId,
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        status: data.status,
      },
    });
  }

  async findUserByEmailOrUsername(str: string) {
    return await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: str }, { username: str }],
      },
    });
  }
}
