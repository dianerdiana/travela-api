import { Module } from '@nestjs/common';
import { WinstonLoggerService } from './logger/winston-logger.service';
import { JwtModule } from '@nestjs/jwt';
import { authConfig } from '@config/auth.config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: authConfig().jwtSecret,
    }),
  ],
  providers: [WinstonLoggerService, JwtStrategy],
  exports: [WinstonLoggerService],
})
export class CoreModule {}
