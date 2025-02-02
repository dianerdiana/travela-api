import { ValidationService } from '@lib/validation.service';
import { JwtAuthGuard } from '@common/guards/auth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateUserDto,
  CreateUserResponseDto,
  createUserSchema,
} from './dto/create-user.dto';
import { UserService } from './user.service';
import { GetManyUserResponseDto } from './dto/get-many-user.dto';
import { JwtPayload } from '@common/types/jwt-payload.type';
import { WebResponse } from '@common/types/web-response.type';
import { Pagination, paginationSchema } from '@common/types/pagination.type';
import { AuthUser } from '@common/decorators/auth-user.decorator';
import { UpdateUserDto, UpdateUserResponseDto } from './dto/update-user.dto';

@Controller('/users')
export class UserController {
  constructor(
    private validationService: ValidationService,
    private userService: UserService,
  ) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() data: CreateUserDto,
    @AuthUser() user: JwtPayload,
  ): Promise<WebResponse<CreateUserResponseDto>> {
    this.validationService.validate(createUserSchema, data);

    const newUser = await this.userService.create(data);

    return {
      error: false,
      message: 'OK',
      data: newUser,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getDataPagination(
    @Query() query: any,
  ): Promise<WebResponse<GetManyUserResponseDto[]>> {
    const pagination = this.validationService.validate(
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

  // @Put()
  // @UseGuards(JwtAuthGuard)
  // async update(
  //   @Body() body: UpdateUserDto,
  // ): Promise<WebResponse<UpdateUserResponseDto>> {}
}
