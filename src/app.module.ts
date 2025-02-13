import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { LibModule } from '@lib/lib.module';
import { AppController } from './app.controller';
import { MyConfigModule } from './config/config.module';
import { RepositoryModule } from './repositories/respository.module';

// API Modules
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    CommonModule,
    LibModule,
    MyConfigModule,
    RepositoryModule,
    AuthModule,
    UserModule,
    CategoryModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
