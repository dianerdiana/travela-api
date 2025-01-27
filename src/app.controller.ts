import { Controller, Get } from '@nestjs/common';
import { WinstonLoggerService } from './core/logger/winston-logger.service';

@Controller()
export class AppController {
  constructor(private readonly logger: WinstonLoggerService) {}

  @Get()
  getHello(): string {
    this.logger.log('Hello World');
    return 'Hello World!';
  }
}
