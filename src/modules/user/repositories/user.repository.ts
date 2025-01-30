import { Pagination } from '@common/utils/web.response';
import { PrismaService } from '@core/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data) {
    return await this.prismaService.user.create({ data });
  }

  async findMany(data: Pagination) {
    const { column, filters, limit, page, search, sort } = data;

    return await this.prismaService.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        OR: [
          { fullName: { contains: search } },
          { email: { contains: search } },
          { username: { contains: search } },
        ],
        ...filters,
      },
      orderBy: {
        [column]: sort,
      },
    });
  }

  async findOne(userId: number) {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }

  async update(userId: number, data) {
    return await this.prismaService.user.update({
      where: { id: userId },
      data,
    });
  }

  async delete(userId: number) {
    return await this.prismaService.user.delete({
      where: { id: userId },
    });
  }

  async deleteMany(userIds: number[]) {
    return await this.prismaService.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
  }
}
