import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
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
      const firstError = exception.errors[0];
      const firstPath = this.capitalizeFirstLetter(firstError.path[0]);
      let message = firstError.message;

      if (firstError.code === 'invalid_type') {
        message = `${firstPath} wajib diisi.`;
      } else if (firstError.code === 'too_small') {
        message = `${firstPath} wajib diisi minimal ${firstError.minimum} karakter.`;
      }

      response.status(400).json({
        error: true,
        statusCode: 400,
        message,
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
