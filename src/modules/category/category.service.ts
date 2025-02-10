// NestJs
import { Injectable } from '@nestjs/common';

// Repository
import { CategoryRepository } from './repository/category.repository';

// Lib
import { ValidationService } from '@lib/validation.service';
import { LangService } from '@lib/i18n/lang.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly validationService: ValidationService,
    private readonly langService: LangService,
  ) {}

  // async create
}
