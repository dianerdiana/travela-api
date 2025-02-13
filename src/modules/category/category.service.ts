// NestJs
import { Injectable } from '@nestjs/common';

// Repository
import { CategoryRepository } from '@repositories/category.repository';

// Lib
import { ValidationService } from '@lib/validation.service';
import { LangService } from '@lib/i18n/lang.service';
import { CreateCategoryDto, CreateCategoryResponse } from './dto/create-category.dto';
import { ImageKitService } from '@lib/image-kit.service';
import { WinstonLoggerService } from '@lib/winston-logger.service';

// Common
import { generateSlug } from '@common/utils/generator.util';
import { Pagination } from '@common/types/pagination.type';
import { GetManyCategoryResponseDto } from './dto/get-category.dto';
import { CategoryStatus } from '@common/types/category-status.type';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly validationService: ValidationService,
    private readonly langService: LangService,
    private readonly imageKitService: ImageKitService,
    private readonly logger: WinstonLoggerService,
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
    this.logger.log(`CategoryService.create: ${JSON.stringify(data)}`);

    const uniqueSlug = await this.generateUniqueSlug(data.name);

    const newIcon = await this.imageKitService.uploadFile(data.icon, 'icon');
    const newCategory = await this.categoryRepository.create({
      name: data.name,
      slug: uniqueSlug,
      iconId: newIcon.fileId,
      status: CategoryStatus.ACTIVE,
    });

    await this.imageKitService.updateRelatedId(newCategory.iconId, newCategory.id);

    return {
      id: newCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
      iconUrl: newCategory.iconId,
    };
  }

  async getDataPagination(paging: Pagination): Promise<GetManyCategoryResponseDto[]> {
    this.logger.log(`UserService.getDataPagination: ${JSON.stringify(paging)}`);
    const categories = await this.categoryRepository.pagination(paging);

    const iconIds = categories.map((category) => category.iconId);
    const categoryIcons = await this.imageKitService.getManyImageUrlByFileId(iconIds);

    return categories.map((category) => {
      const categoryIcon = categoryIcons.find((icon) => category.iconId === icon.fileId);

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        status: category.status,
        iconUrl: categoryIcon.url,
      };
    });
  }
}
