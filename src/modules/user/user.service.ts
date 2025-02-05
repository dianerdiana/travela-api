// NestJs
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// Repository
import { UserRepository } from './repositories/user.repository';
import { RoleRepository } from './repositories/role.repository';
import { UserRoleRepository } from './repositories/user-role.repository';

// DTO
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserResponseDto } from './dto/update-user.dto';
import { GetManyUserResponseDto } from './dto/get-many-user.dto';

// Common
import { Pagination } from '@common/types/pagination.type';
import { UserStatus } from '@common/types/user-status.type';

// Lib
import { PasswordService } from '@lib/password.service';
import { ImageKitService } from '@lib/image-kit.service';
import { WinstonLoggerService } from '@lib/winston-logger.service';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private logger: WinstonLoggerService,
    private passwordService: PasswordService,
    private imageKitService: ImageKitService,
    private roleRepository: RoleRepository,
    private userRoleRepository: UserRoleRepository,
  ) {}

  async create(data: CreateUserDto): Promise<CreateUserResponseDto> {
    this.logger.log(`AuthService.register: ${data}`);

    const existEmail = await this.userRepository.findUserByEmailOrUsername(
      data.email,
    );
    const existUsername = await this.userRepository.findUserByEmailOrUsername(
      data.username,
    );

    if (existEmail) {
      throw new HttpException('Email already exist.', HttpStatus.BAD_REQUEST);
    }

    if (existUsername) {
      throw new HttpException(
        'Username already exist.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const imageKitFile = await this.imageKitService.uploadFile(
      data.avatar,
      'avatar',
    );
    const password = await this.passwordService.hashPassword(data.password);
    const userRole = await this.roleRepository.findRoleByName('user');

    const newUser = await this.userRepository.create({
      ...data,
      avatar: imageKitFile.filePath,
      avatarId: imageKitFile.fileId,
      status: UserStatus[data.status.toUpperCase()],
      password,
    });

    await this.userRoleRepository.create(newUser.id, userRole.id);

    return {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      username: newUser.username,
      phone: newUser.phone,
      status: newUser.status,
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
