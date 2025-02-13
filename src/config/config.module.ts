import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './app.config';
import { databaseConfig } from './database.config';
import { envSchema } from './validation.schema';
import { authConfig } from './auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig],
      validate: (config) => {
        // Validasi dengan Zod
        const parsed = envSchema.safeParse(config);
        if (!parsed.success) {
          // Jika validasi gagal, lempar error
          console.error('Environment variables validation failed:', parsed.error.format());
          throw new Error('Invalid environment variables');
        }
        return parsed.data; // Jika validasi sukses, return hasilnya
      },
    }),
  ],
})
export class MyConfigModule {}
