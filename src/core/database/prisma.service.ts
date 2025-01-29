import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { WinstonLoggerService } from '../logger/winston-logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit
{
  constructor(private readonly logger: WinstonLoggerService) {
    super({
      log: [
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });
  }

  onModuleInit() {
    this.$on('info', (e) => {
      this.logger.log(String(e));
    });
    this.$on('warn', (e) => {
      this.logger.warn(String(e));
    });
    this.$on('error', (e) => {
      this.logger.error(String(e));
    });
    this.$on('query', (e) => {
      this.logger.log(String(e));
    });
  }
}
