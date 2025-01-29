import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';
import { MyConfigModule } from './config/config.module';

@Module({
  imports: [CoreModule, MyConfigModule],
  controllers: [AppController],
})
export class AppModule {}
