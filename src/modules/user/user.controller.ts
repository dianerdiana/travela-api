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
import {
  UpdateAvatarDto,
  UpdateAvatarResponse,
  updateAvatarSchema,
} from './dto/update-avatar.dto';
import { transformUserIdSchema } from './dto/transform-user-id.dto';

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

@Controller('/user')
@UseGuards(UserRoleGuard)
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly validationService: ValidationService,
    private readonly userService: UserService,
    private readonly langService: LangService,
  ) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @UseInterceptors(
    FileUploadInterceptor.prototype.uploadFile('avatar', IMG_MIMETYPE),
  )
  async create(
    @Body() body: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse<CreateUserResponseDto>> {
    const validateData = { ...body, avatar: file };

    const validatedData = await this.validationService.validateAsync(
      createUserSchema,
      validateData,
    );

    const newUser = await this.userService.create(validatedData);

    return {
      error: false,
      message: this.langService.t('response.ok'),
      data: newUser,
    };
  }

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  async getDataPagination(
    @Query() query: any,
  ): Promise<WebResponse<GetManyUserResponseDto[]>> {
    const pagination = await this.validationService.validateAsync(
      paginationSchema,
      query,
    );

    const users = await this.userService.getDataPagination(pagination);
    const allUsers = await this.userService.getCountDataPagination(pagination);

    return {
      error: false,
      message: this.langService.t('response.ok'),
      data: users,
      paging: {
        totalPages: Math.ceil(allUsers / query.limit),
        column: query.column,
        filters: query.filters,
        limit: query.limit,
        page: query.page,
        search: query.search,
        sort: query.sort,
      },
    };
  }

  @Get('/:userId/current')
  @HttpCode(HttpStatus.OK)
  async getUserByUserId(
    @Param('userId') userId: any,
    @AuthUser() user: JwtPayload,
  ): Promise<WebResponse<any>> {
    const validatedUserId = await this.validationService.validateAsync(
      transformUserIdSchema,
      userId,
    );

    if (user.role === UserRole.USER && user.sub !== validatedUserId) {
      throw new ForbiddenException(this.langService.t('exception.forbidden'));
    }

    const data = await this.userService.getUserById(validatedUserId);

    return {
      error: false,
      message: this.langService.t('response.ok'),
      data: data,
    };
  }

  @Put('/:userId/update')
  @HttpCode(HttpStatus.ACCEPTED)
  async update(
    @Body() body: UpdateUserDto,
    @AuthUser() user: JwtPayload,
    @Param('userId') userId: any,
  ): Promise<WebResponse<UpdateUserResponseDto>> {
    if (user.role === UserRole.USER && user.sub !== userId) {
      throw new ForbiddenException(this.langService.t('exception.forbidden'));
    }

    const validated = await this.validationService.validateAsync(
      updateUserSchema,
      body,
    );
    const validatedUserId = await this.validationService.validateAsync(
      transformUserIdSchema,
      userId,
    );

    const updatedResponse = await this.userService.update(
      validated,
      validatedUserId,
    );

    return {
      error: false,
      message: this.langService.t('response.ok'),
      data: updatedResponse,
    };
  }

  @Put('/:userId/update-avatar')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(
    FileUploadInterceptor.prototype.uploadFile('avatar', IMG_MIMETYPE),
  )
  async updateAvatar(
    @Body() body: UpdateAvatarDto,
    @AuthUser() user: JwtPayload,
    @Param('userId') userId: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse<UpdateAvatarResponse>> {
    if (user.role === UserRole.USER && user.sub !== userId) {
      throw new ForbiddenException(this.langService.t('exception.forbidden'));
    }

    const validated = await this.validationService.validateAsync(
      updateAvatarSchema,
      { avatar: file },
    );
    const validatedUserId = await this.validationService.validateAsync(
      transformUserIdSchema,
      userId,
    );

    const udpatedResponse = await this.userService.updateAvatar(
      validated,
      validatedUserId,
    );

    return {
      error: false,
      message: this.langService.t('response.ok'),
      data: udpatedResponse,
    };
  }

  @Delete('/:userId/delete')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async delete(@Param('userId') userId: any): Promise<WebResponse<any>> {
    const validatedUserId = await this.validationService.validateAsync(
      transformUserIdSchema,
      userId,
    );
    const deletedUser = await this.userService.delete(validatedUserId);

    return {
      error: false,
      message: this.langService.t('response.success'),
      data: deletedUser.fullName,
    };
  }
}
