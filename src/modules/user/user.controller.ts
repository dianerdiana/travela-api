// NestJs
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

// Service
import { UserService } from './user.service';

// Dto
import {
  CreateUserDto,
  CreateUserResponseDto,
  createUserSchema,
} from './dto/create-user.dto';
import { GetManyUserResponseDto } from './dto/get-many-user.dto';
import {
  UpdateUserDto,
  UpdateUserResponseDto,
  updateUserSchema,
} from './dto/update-user.dto';

// Lib
import { ValidationService } from '@lib/validation.service';
import { LangService } from '@lib/i18n/lang.service';

// Common
import { JwtAuthGuard } from '@common/guards/auth.guard';
import { WebResponse } from '@common/types/web-response.type';
import { Pagination, paginationSchema } from '@common/types/pagination.type';
import { UserRoleGuard } from '@common/guards/user-role.guard';
import { Roles } from '@common/decorators/role.decorator';
import { UserRole } from '@common/types/user-role.type';
import { FileUploadInterceptor } from '@common/interceptors/file-upload.interceptor';
import { IMG_MIMETYPE } from '@common/constants/image-mimetype.constant';
import { AuthUser } from '@common/decorators/auth-user.decorator';
import { JwtPayload } from '@common/types/jwt-payload.type';

@Controller('users')
@UseGuards(UserRoleGuard)
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly validationService: ValidationService,
    private readonly userService: UserService,
    private readonly langService: LangService,
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async create(
    @Body() data: CreateUserDto,
  ): Promise<WebResponse<CreateUserResponseDto>> {
    await this.validationService.validateAsync(createUserSchema, data);

    const newUser = await this.userService.create(data);

    return {
      error: false,
      message: 'OK',
      data: newUser,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getDataPagination(
    @Query() query: any,
  ): Promise<WebResponse<GetManyUserResponseDto[]>> {
    const pagination = this.validationService.validateAsync(
      paginationSchema,
      query,
    ) as Pagination;

    const users = await this.userService.getDataPagination(pagination);

    return {
      error: false,
      message: 'OK',
      data: users,
      paging: {
        total_pages: users.length / query.limit,
        column: query.column,
        filters: query.filters,
        limit: query.limit,
        page: query.page,
        search: query.search,
        sort: query.sort,
      },
    };
  }

  @Put()
  @HttpCode(HttpStatus.ACCEPTED)
  async update(
    @Body() body: UpdateUserDto,
    @AuthUser() user: JwtPayload,
  ): Promise<WebResponse<UpdateUserResponseDto>> {
    await this.validationService.validateAsync(updateUserSchema, body);

    if (user.sub !== body.userId) {
      throw new ForbiddenException(this.langService.t('exception.forbidden'));
    }

    const updatedResponse = await this.userService.update(body);

    return {
      error: false,
      message: 'OK',
      data: updatedResponse,
    };
  }
}
