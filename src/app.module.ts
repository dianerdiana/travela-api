import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { LibModule } from '@lib/lib.module';
import { AppController } from './app.controller';
import { MyConfigModule } from './config/config.module';

// API Modules
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [CommonModule, LibModule, MyConfigModule, AuthModule, UserModule],
  controllers: [AppController],
})
export class AppModule {}
