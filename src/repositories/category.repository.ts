import { Pagination } from '@common/types/pagination.type';
import { PrismaService } from '@lib/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: any) {
    return await this.prismaService.category.create({ data });
  }

  async findCategoryBySlug(slug: string) {
    return await this.prismaService.category.findFirst({ where: { slug } });
  }

  async findCategoryById(categoryId: number) {
    return await this.prismaService.category.findFirst({
      where: { id: categoryId },
    });
  }

  async pagination(data: Pagination) {
    const { column, filters, limit, page, search, sort } = data;

    return await this.prismaService.category.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        OR: [{ name: { contains: search } }, { slug: { contains: search } }],
        ...filters,
      },
      orderBy: {
        [column]: sort,
      },
    });
  }

  async paginationCount(data: Pagination) {
    const { column, filters, search, sort } = data;

    return await this.prismaService.category.count({
      where: {
        OR: [{ name: { contains: search } }, { slug: { contains: search } }],
        ...filters,
      },
      orderBy: {
        [column]: sort,
      },
    });
  }

  async updateCategory(data: any, categoryId: number) {
    return await this.prismaService.category.update({
      data,
      where: { id: categoryId },
    });
  }

  async delete(categoryId: number) {
    return await this.prismaService.category.delete({
      where: { id: categoryId },
    });
  }

  async deleteMany(categoryIds: number[]) {
    return await this.prismaService.category.deleteMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
    });
  }
}
