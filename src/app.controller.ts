import { Controller, Get } from '@nestjs/common';
import { WinstonLoggerService } from './lib/winston-logger.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly logger: WinstonLoggerService,
    private configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log('Hello World');
    const databaseUrl = this.configService.get('databaseUrl');
    this.logger.error(databaseUrl, 'Error');
    return 'Hello World!';
  }
}
