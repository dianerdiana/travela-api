import { PrismaService } from '@core/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { UserStatus } from '@common/constants/user-status';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async register(data: RegisterDto & { status: UserStatus }) {
    return await this.prismaService.user.create({
      data: {
        avatar: data.avatar,
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

  async login(email: string, password: string) {
    return await this.prismaService.user.findFirst({
      where: {
        OR: [{ email }, { username: email }],
        password,
      },
    });
  }
}
