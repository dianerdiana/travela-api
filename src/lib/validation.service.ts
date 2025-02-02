import { Injectable } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ValidationService {
  async validate<T>(zodType: ZodType<T>, data: T): Promise<T> {
    return await zodType.parseAsync(data);
  }
}
