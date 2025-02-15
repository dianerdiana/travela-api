import { PrismaService } from '@lib/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PackageTourRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create() {}
}
