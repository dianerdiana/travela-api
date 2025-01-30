import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AppController } from './app.controller';
import { MyConfigModule } from './config/config.module';

// API Modules
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [CoreModule, MyConfigModule, UserModule],
  controllers: [AppController],
})
export class AppModule {}
