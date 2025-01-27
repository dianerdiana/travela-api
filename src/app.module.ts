import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';

@Module({
  imports: [CoreModule],
  controllers: [AppController],
})
export class AppModule {}
