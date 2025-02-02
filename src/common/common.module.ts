import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './filters/error.filter';
import { ValidationService } from './services/validation.service';
import { PasswordService } from './services/password.service';

@Global()
@Module({
  imports: [],
  providers: [
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    PasswordService,
  ],
  exports: [ValidationService, PasswordService],
})
export class CommonModule {}
