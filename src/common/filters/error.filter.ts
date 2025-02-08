import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { ZodError } from 'zod';
import { LangService } from '@lib/i18n/lang.service';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  constructor(private readonly langService: LangService) {}

  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    console.log(exception);
    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        error: true,
        statusCode: exception.getStatus(),
        message: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      const messages = exception.errors.map((error) => {
        const message = error;

        if (error.message === 'Required') {
          message['message'] = this.langService.t('validation.required');
        } else if (error.code === 'invalid_type') {
          message['message'] = this.langService.t('validation.invalid_type');
        } else if (error.code === 'too_small') {
          message['message'] = this.langService.t('validation.too_small', {
            min: error.minimum,
          });
        } else if (error.code === 'too_big') {
          message['message'] = this.langService.t('validation.too_big', {
            max: error.maximum,
          });
        }

        return message;
      });

      response.status(400).json({
        error: true,
        statusCode: 400,
        message: messages,
      });
    } else {
      response.status(500).json({
        error: true,
        statusCode: 500,
        message: exception.message,
      });
    }
  }

  capitalizeFirstLetter(text: string | number): string {
    if (typeof text === 'number') {
      return String(text);
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
