// NestJs
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

// Service
import { CategoryService } from './category.service';

// Dto
import {
  CreateCategoryDto,
  CreateCategoryResponseDto,
  createCategorySchema,
} from './dto/create-category.dto';
import { GetManyCategoryResponseDto } from './dto/get-many-category.dto';
import { transformCategoryIdSchema } from './dto/transform-category-id.dto';
import { GetCategoryResponseDto } from './dto/get-category.dto';
import { UpdateIconResponseDto, updateIconSchema } from './dto/update-icon.dto';
import {
  UpdateCategoryDto,
  UpdateCategoryResponseDto,
  updateCategorySchema,
} from './dto/update-category.dto';

// Lib
import { ValidationService } from '@lib/validation.service';
import { LangService } from '@lib/i18n/lang.service';

// Common
import { JwtAuthGuard } from '@common/guards/auth.guard';
import { WebResponse } from '@common/types/web-response.type';
import { paginationSchema } from '@common/types/pagination.type';
import { UserRoleGuard } from '@common/guards/user-role.guard';
import { Roles } from '@common/decorators/role.decorator';
import { UserRole } from '@common/types/user-role.type';
import { FileUploadInterceptor } from '@common/interceptors/file-upload.interceptor';
import { IMG_MIMETYPE } from '@common/constants/image-mimetype.constant';
import { AuthUser } from '@common/decorators/auth-user.decorator';
import { JwtPayload } from '@common/types/jwt-payload.type';

@Controller('/category')
@UseGuards(UserRoleGuard)
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(
    private readonly validationService: ValidationService,
    private readonly categoryService: CategoryService,
    private readonly langService: LangService,
  ) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @UseInterceptors(FileUploadInterceptor.prototype.uploadFile('icon', IMG_MIMETYPE))
  async create(
    @Body() body: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse<CreateCategoryResponseDto>> {
    const validateData = { ...body, icon: file };

    const validatedData = await this.validationService.validateAsync(
      createCategorySchema,
      validateData,
    );

    const newCategory = await this.categoryService.create(validatedData);

    return {
      error: false,
      message: this.langService.t('response.ok'),
      data: newCategory,
    };
  }

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getDataPagination(@Query() query: any): Promise<WebResponse<GetManyCategoryResponseDto[]>> {
    const pagination = await this.validationService.validateAsync(paginationSchema, query);

    const categories = await this.categoryService.getDataPagination(pagination);
    const allCategoriesLength = await this.categoryService.getCountPagination(pagination);

    return {
      error: false,
      message: this.langService.t('response.ok'),
      data: categories,
      paging: {
        totalPages: Math.ceil(allCategoriesLength / query.limit),
        column: query.column,
        filters: query.filters,
        limit: query.limit,
        page: query.page,
        search: query.search,
        sort: query.sort,
      },
    };
  }

  @Get('/:categoryId/current')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async getCategoryByCategoryId(
    @Param('categoryId') categoryId: any,
  ): Promise<WebResponse<GetCategoryResponseDto>> {
    const validatedCategoryId = await this.validationService.validateAsync(
      transformCategoryIdSchema,
      categoryId,
    );

    const data = await this.categoryService.getCategoryById(validatedCategoryId);

    return {
      error: false,
      message: this.langService.t('response.ok'),
      data: data,
    };
  }

  @Get('/:slug/slug')
  @HttpCode(HttpStatus.OK)
  async getCategoryBySlug(
    @Param('slug') slug: string,
  ): Promise<WebResponse<GetCategoryResponseDto>> {
    const data = await this.categoryService.getCategoryBySlug(slug);

    return {
      error: false,
      message: this.langService.t('response.ok'),
      data: data,
    };
  }

  @Put('/:categoryId/update')
  @HttpCode(HttpStatus.ACCEPTED)
  async update(
    @Body() body: UpdateCategoryDto,
    @AuthUser() user: JwtPayload,
    @Param('categoryId') categoryId: any,
  ): Promise<WebResponse<UpdateCategoryResponseDto>> {
    if (user.role === UserRole.USER && user.sub !== categoryId) {
      throw new ForbiddenException(this.langService.t('exception.forbidden'));
    }

    const validated = await this.validationService.validateAsync(updateCategorySchema, body);
    const validatedCategoryId = await this.validationService.validateAsync(
      transformCategoryIdSchema,
      categoryId,
    );

    const updatedResponse = await this.categoryService.update(validated, validatedCategoryId);

    return {
      error: false,
      message: this.langService.t('response.ok'),
      data: updatedResponse,
    };
  }

  @Put('/:categoryId/update-icon')
  @HttpCode(HttpStatus.ACCEPTED)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @UseInterceptors(FileUploadInterceptor.prototype.uploadFile('icon', IMG_MIMETYPE))
  async updateAvatar(
    @Param('categoryId') categoryId: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse<UpdateIconResponseDto>> {
    const validated = await this.validationService.validateAsync(updateIconSchema, {
      icon: file,
    });
    const validatedCategoryId = await this.validationService.validateAsync(
      transformCategoryIdSchema,
      categoryId,
    );

    const udpatedResponse = await this.categoryService.updateIcon(validated, validatedCategoryId);

    return {
      error: false,
      message: this.langService.t('response.ok'),
      data: udpatedResponse,
    };
  }

  @Delete('/:categoryId/delete')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async delete(@Param('categoryId') categoryId: any): Promise<WebResponse<any>> {
    const validatedCategoryId = await this.validationService.validateAsync(
      transformCategoryIdSchema,
      categoryId,
    );
    const deletedUser = await this.categoryService.delete(validatedCategoryId);

    return {
      error: false,
      message: this.langService.t('response.success'),
      data: deletedUser.name,
    };
  }
}
