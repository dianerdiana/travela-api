import { Module } from '@nestjs/common';
import { WinstonLoggerService } from './logger/winston-logger.service';
import { JwtAuthGuard } from './guards/auth.guard';

@Module({
  imports: [],
  providers: [WinstonLoggerService, JwtAuthGuard],
  exports: [WinstonLoggerService, JwtAuthGuard],
})
export class CoreModule {}
