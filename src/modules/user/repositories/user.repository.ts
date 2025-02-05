import { Pagination } from '@common/types/pagination.type';
import { PrismaService } from '@lib/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserDto & { avatarId: string }) {
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

  async findManyBasedOnColumn(column: string, value: any[]) {
    return await this.prismaService.user.findMany({
      where: {
        [column]: {
          in: value,
        },
      },
    });
  }

  async pagination(data: Pagination) {
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

  async findUserByEmailOrUsername(str: string) {
    return await this.prismaService.user.findFirst({
      where: {
        OR: [{ email: str }, { username: str }],
      },
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
