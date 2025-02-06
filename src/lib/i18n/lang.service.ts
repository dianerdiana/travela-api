import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class LangService {
  constructor(private readonly i18nService: I18nService) {}

  private get currentLang() {
    return I18nContext.current().lang;
  }

  async translate(key: string, args?: Record<string, any>): Promise<string> {
    const lang = this.currentLang;

    return await this.i18nService.t(key, { lang, args });
  }
}
