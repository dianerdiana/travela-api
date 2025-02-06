// NestJs
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

// Module
import { I18NModuleSetup } from './i18n/i18n.module';

// Config
import { authConfig } from '@config/auth.config';

// Service
import { WinstonLoggerService } from './winston-logger.service';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from './prisma.service';
import { PasswordService } from './password.service';
import { ValidationService } from './validation.service';
import { ImageKitService } from './image-kit.service';
import { LangService } from './i18n/lang.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: authConfig().jwtSecret,
    }),
    I18NModuleSetup,
  ],
  providers: [
    WinstonLoggerService,
    JwtStrategy,
    PrismaService,
    PasswordService,
    ValidationService,
    ImageKitService,
    LangService,
  ],
  exports: [
    WinstonLoggerService,
    PrismaService,
    PasswordService,
    ValidationService,
    ImageKitService,
    LangService,
  ],
})
export class LibModule {}
