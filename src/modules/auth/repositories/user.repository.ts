import { PrismaService } from '@core/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async register(data: RegisterDto) {
    return await this.prismaService.user.create({
      data: {
        avatar: data.avatar,
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
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
