import { Injectable } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ValidationService {
  async validateAsync<T>(zodType: ZodType<T>, data: T): Promise<T> {
    return await zodType.parseAsync(data);
  }
}
