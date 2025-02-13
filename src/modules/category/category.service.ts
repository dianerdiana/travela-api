// NestJs
import { Injectable } from '@nestjs/common';

// Repository
import { CategoryRepository } from './repository/category.repository';

// Lib
import { ValidationService } from '@lib/validation.service';
import { LangService } from '@lib/i18n/lang.service';
import { CreateCategoryDto, CreateCategoryResponse } from './dto/create-category.dto';
import { ImageKitService } from '@lib/image-kit.service';
import { WinstonLoggerService } from '@lib/winston-logger.service';
import { generateSlug } from '@common/utils/generator.util';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly validationService: ValidationService,
    private readonly langService: LangService,
    private readonly imageKitService: ImageKitService,
    private readonly loggger: WinstonLoggerService,
  ) {}

  async generateUniqueSlug(name: string, categoryId?: number): Promise<string> {
    const slug = generateSlug(name);
    let uniqueSlug = slug;
    let count = 1;

    let existingSlug = await this.categoryRepository.findCategoryBySlug(uniqueSlug);

    while (existingSlug && existingSlug.id !== categoryId) {
      uniqueSlug = `${slug}-${count}`;
      count += 1;

      existingSlug = await this.categoryRepository.findCategoryBySlug(uniqueSlug);
    }

    return uniqueSlug;
  }

  async create(data: CreateCategoryDto): Promise<CreateCategoryResponse> {
    this.loggger.log(`CategoryService.create: ${JSON.stringify(data)}`);

    const uniqueSlug = await this.generateUniqueSlug(data.name);

    const newIcon = await this.imageKitService.uploadFile(data.icon, 'icon');
    const newCategory = await this.categoryRepository.create({
      name: data.name,
      slug: uniqueSlug,
      iconId: newIcon.fileId,
    });

    await this.imageKitService.updateRelatedId(newCategory.iconId, newCategory.id);

    return {
      id: newCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
      iconUrl: newCategory.iconId,
    };
  }

  // async getDataPagination()
}
