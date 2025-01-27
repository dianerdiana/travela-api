import { Module } from '@nestjs/common';
import { WinstonLoggerService } from './logger/winston-logger.service';

@Module({
  imports: [],
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class CoreModule {}
