import { I18nContext, I18nService } from 'nestjs-i18n';
import { Controller, Get } from '@nestjs/common';
import { WinstonLoggerService } from './lib/winston-logger.service';
import { LangService } from '@lib/i18n/lang.service';

@Controller()
export class AppController {
  constructor(
    private readonly logger: WinstonLoggerService,
    private readonly langService: LangService,
    private readonly i18n: I18nService,
  ) {}

  @Get()
  async getHello() {
    this.logger.log('Hello World');
    const currentLang = I18nContext.current().lang;

    const validationError = this.langService.t('validation.too_small', {
      min: 2,
    });
    const message = this.langService.t('response.success');

    const validationTooBig = this.i18n.t('validation.required', {
      lang: currentLang,
      args: { max: 100 },
    });

    return {
      validationError,
      message,
      validationTooBig,
    };
  }
}
