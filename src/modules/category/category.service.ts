// NestJs
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

// Repository
import { CategoryRepository } from '@repositories/category.repository';

// Lib
import { LangService } from '@lib/i18n/lang.service';
import { ImageKitService } from '@lib/image-kit.service';
import { WinstonLoggerService } from '@lib/winston-logger.service';

// Common
import { generateSlug } from '@common/utils/generator.util';
import { Pagination } from '@common/types/pagination.type';
import { CategoryStatus } from '@common/types/category-status.type';

// Dto
import { CreateCategoryDto, CreateCategoryResponseDto } from './dto/create-category.dto';
import { GetManyCategoryResponseDto } from './dto/get-many-category.dto';
import { GetCategoryResponseDto } from './dto/get-category.dto';
import { UpdateCategoryDto, UpdateCategoryResponseDto } from './dto/update-category.dto';
import { UpdateIconDto, UpdateIconResponseDto } from './dto/update-icon.dto';
import { FOLDER_IMAGEKIT } from '@common/constants/image-kit-folder.constant';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
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

  async create(data: CreateCategoryDto): Promise<CreateCategoryResponseDto> {
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
    };
  }

  async getDataPagination(paging: Pagination): Promise<GetManyCategoryResponseDto[]> {
    this.logger.log(`CategoryService.getDataPagination: ${JSON.stringify(paging)}`);
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

  async getCountPagination(paging: Pagination): Promise<number> {
    this.logger.log(`CategoryService.getCountPagination: ${JSON.stringify(paging)}`);

    return await this.categoryRepository.paginationCount(paging);
  }

  async getCategoryById(categoryId: number): Promise<GetCategoryResponseDto> {
    this.logger.log(`CategoryService.getCategoryById: ${categoryId}`);
    const category = await this.categoryRepository.findCategoryById(categoryId);

    if (!category) {
      throw new BadRequestException(
        this.langService.t('exception.not_found', {
          label: 'Category',
        }),
      );
    }

    const iconUrl = await this.imageKitService.getImageUrl(category.iconId);

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      iconUrl: iconUrl,
      status: category.status,
    };
  }

  async getCategoryBySlug(slug: string): Promise<GetCategoryResponseDto> {
    this.logger.log(`CategoryService.getCategoryById: ${slug}`);
    const category = await this.categoryRepository.findCategoryBySlug(slug);

    if (!category) {
      throw new BadRequestException(
        this.langService.t('exception.not_found', {
          label: 'Category',
        }),
      );
    }

    const iconUrl = await this.imageKitService.getImageUrl(category.iconId);

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      iconUrl: iconUrl,
      status: category.status,
    };
  }

  async update(data: UpdateCategoryDto, categoryId: number): Promise<UpdateCategoryResponseDto> {
    this.logger.log(`CategoryService.update: ${JSON.stringify(data)}`);
    const user = await this.categoryRepository.findCategoryById(categoryId);

    if (!user) {
      throw new NotFoundException(
        this.langService.t('exception.not_found', {
          label: 'Category',
        }),
      );
    }

    const updatedCategory = await this.categoryRepository.updateCategory(categoryId, data);

    return {
      id: updatedCategory.id,
      name: updatedCategory.name,
      slug: updatedCategory.slug,
      status: updatedCategory.status,
    };
  }

  async updateIcon(data: UpdateIconDto, categoryId: number): Promise<UpdateIconResponseDto> {
    this.logger.log(`CategoryService.updateIcon: ${JSON.stringify(data)}`);

    const category = await this.categoryRepository.findCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException(
        this.langService.t('exception.not_found', {
          label: 'Category',
        }),
      );
    }

    await this.imageKitService.deleteFile(category.iconId);

    const imageKitResponse = await this.imageKitService.uploadFile(data.icon, FOLDER_IMAGEKIT.ICON);
    const updatedCategory = await this.categoryRepository.updateCategory(categoryId, {
      iconId: imageKitResponse.fileId,
    });

    return updatedCategory.iconId;
  }

  async delete(userId: number) {
    this.logger.log(`CategoryService.delete: ${JSON.stringify(userId)}`);
    const category = await this.categoryRepository.findCategoryById(userId);

    if (!category) {
      throw new NotFoundException(
        this.langService.t('exception.not_found', {
          label: 'User',
        }),
      );
    }

    const deletedCategory = await this.categoryRepository.delete(userId);

    return {
      id: deletedCategory.id,
      name: deletedCategory.name,
    };
  }

  async deleteMany(categoryIds: number[]) {
    this.logger.log(`CategoryService.deleteMany: ${JSON.stringify(categoryIds)}`);
    const users = await this.categoryRepository.findManyCategoryById(categoryIds);

    if (users.length !== categoryIds.length) {
      throw new NotFoundException(
        this.langService.t('exception.not_found', {
          label: 'Some user',
        }),
      );
    }

    return await this.categoryRepository.deleteMany(categoryIds);
  }
}
