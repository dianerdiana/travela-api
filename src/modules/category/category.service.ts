// NestJs
import { Injectable } from '@nestjs/common';

// Repository
import { CategoryRepository } from './repository/category.repository';

// Lib
import { ValidationService } from '@lib/validation.service';
import { LangService } from '@lib/i18n/lang.service';
import {
  CreateCategoryDto,
  CreateCategoryResponse,
} from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly validationService: ValidationService,
    private readonly langService: LangService,
  ) {}

  async create(data: CreateCategoryDto): Promise<CreateCategoryResponse> {
    const newCategory = await this.categoryRepository.create(data);

    return {
      id: newCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
      iconUrl: newCategory.iconId,
    };
  }
}
