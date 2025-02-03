import { HttpException, Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { WinstonLoggerService } from '@lib/winston-logger.service';

// DTO
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserResponseDto } from './dto/update-user.dto';
import { GetManyUserResponseDto } from './dto/get-many-user.dto';
import { Pagination } from '@common/types/pagination.type';
import { UserStatus } from '@common/types/user-status.type';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private logger: WinstonLoggerService,
  ) {}

  async create(data: CreateUserDto): Promise<CreateUserResponseDto> {
    this.logger.log(`Creating new user with email: ${data.email}`);
    const newUser = await this.userRepository.create({
      ...data,
      status: UserStatus.ACTIVE,
    });

    return {
      id: newUser.id,
      fullName: newUser.fullName,
      phone: newUser.phone,
      email: newUser.email,
      username: newUser.username,
    };
  }

  async getDataPagination(
    paging: Pagination,
  ): Promise<GetManyUserResponseDto[]> {
    const users = await this.userRepository.pagination(paging);

    return users.map((item) => ({
      id: item.id,
      fullName: item.fullName,
      phone: item.phone,
      email: item.email,
      username: item.username,
    }));
  }

  async update(data: UpdateUserDto): Promise<UpdateUserResponseDto> {
    const user = await this.userRepository.findOne(data.userId);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    this.logger.log(`Updating user with id: ${data.userId}`);
    const updatedData = await this.userRepository.update(data.userId, data);

    return {
      id: updatedData.id,
      fullName: updatedData.fullName,
      phone: updatedData.phone,
      email: updatedData.email,
      username: updatedData.username,
    };
  }

  async delete(userId: number) {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    this.logger.log(`Deleting user with id: ${userId}`);

    return await this.userRepository.delete(userId);
  }

  async deleteMany(userIds: number[]) {
    const users = await this.userRepository.findManyBasedOnColumn(
      'id',
      userIds,
    );

    if (users.length !== userIds.length) {
      throw new HttpException("Some user doesn't exists.", 404);
    }

    return await this.userRepository.deleteMany(userIds);
  }
}
