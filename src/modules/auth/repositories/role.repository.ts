import { PrismaService } from '@core/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleRepository {
  constructor(private prismaService: PrismaService) {}

  async findRoleById(roleId: number) {
    return await this.prismaService.role.findFirst({
      where: {
        id: roleId,
      },
    });
  }

  async findRoleByName(roleName: string) {
    return await this.prismaService.role.findFirst({
      where: {
        name: roleName,
      },
    });
  }
}
