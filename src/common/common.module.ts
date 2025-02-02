import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './filters/error.filter';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [],
})
export class CommonModule {}
