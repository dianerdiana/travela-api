import { PrismaService } from '@core/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRoleRepository {
  constructor(private prismaService: PrismaService) {}

  async create(userId: number, roleId: number) {
    return await this.prismaService.userRole.create({
      data: { userId, roleId },
    });
  }

  async findUserRoleByUserId(userId: number) {
    return await this.prismaService.userRole.findFirst({
      where: { userId },
    });
  }
}
