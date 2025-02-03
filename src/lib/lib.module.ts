// NestJs
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

// Config
import { authConfig } from '@config/auth.config';

// Service
import { WinstonLoggerService } from './winston-logger.service';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from './prisma.service';
import { PasswordService } from './password.service';
import { ValidationService } from './validation.service';
import { ImageKitService } from './image-kit.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: authConfig().jwtSecret,
    }),
  ],
  providers: [
    WinstonLoggerService,
    JwtStrategy,
    PrismaService,
    PasswordService,
    ValidationService,
    ImageKitService,
  ],
  exports: [
    WinstonLoggerService,
    PrismaService,
    PasswordService,
    ValidationService,
    ImageKitService,
  ],
})
export class LibModule {}
