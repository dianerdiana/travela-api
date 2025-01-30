import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { WinstonLoggerService } from './core/logger/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);
  const logger = app.get(WinstonLoggerService);

  // Use cookie
  app.use(cookieParser('MY SECRET KEY'));

  // Set static assets
  app.useStaticAssets(join(__dirname, '..', '/public'));
  app.useStaticAssets(join(__dirname, '..', '/views'));
  app.useStaticAssets(join(__dirname, '..', '/uploads'), {
    prefix: '/uploads',
  });

  // Set view engine
  app.setViewEngine('hbs');

  // Logger
  app.useLogger(logger);

  await app.listen(configService.get('PORT'), () => {
    console.log(`App is running on port: ${configService.get('PORT')}`);
  });
}
bootstrap();
