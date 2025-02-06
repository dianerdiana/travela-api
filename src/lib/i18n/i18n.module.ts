import { Module } from '@nestjs/common';
import * as path from 'path';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { appConfig } from '@config/app.config';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: appConfig().lang,
      loaderOptions: {
        path: path.join(__dirname, '../../i18n'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
  controllers: [],
})
export class I18NModuleSetup {}
