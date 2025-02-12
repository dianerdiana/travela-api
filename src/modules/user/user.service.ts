// NestJs
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

// Repository
import { UserRepository } from './repository/user.repository';
import { RoleRepository } from './repository/role.repository';
import { UserRoleRepository } from './repository/user-role.repository';

// DTO
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserResponseDto } from './dto/update-user.dto';
import { GetManyUserResponseDto } from './dto/get-many-user.dto';

// Common
import { Pagination } from '@common/types/pagination.type';
import { UserStatus } from '@common/types/user-status.type';
import { FOLDER_IMAGEKIT } from '@common/constants/image-kit-folder.constant';

// Lib
import { PasswordService } from '@lib/password.service';
import { ImageKitService } from '@lib/image-kit.service';
import { WinstonLoggerService } from '@lib/winston-logger.service';
import { LangService } from '@lib/i18n/lang.service';
import { UpdateAvatarDto, UpdateAvatarResponse } from './dto/update-avatar.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private logger: WinstonLoggerService,
    private passwordService: PasswordService,
    private imageKitService: ImageKitService,
    private roleRepository: RoleRepository,
    private userRoleRepository: UserRoleRepository,
    private readonly langService: LangService,
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
      throw new BadRequestException(
        this.langService.t('exception.already_exist', {
          label: 'Email',
        }),
      );
    }

    if (existUsername) {
      throw new BadRequestException(
        this.langService.t('exception.already_exist', {
          label: 'Username',
        }),
      );
    }

    if (data.confirmPassword !== data.password) {
      throw new BadRequestException(
        this.langService.t('exception.confirm_password_invalid'),
      );
    }

    const imageKitFile = await this.imageKitService.uploadFile(
      data.avatar,
      FOLDER_IMAGEKIT.AVATAR,
    );
    const password = await this.passwordService.hashPassword(data.password);
    const userRole = await this.roleRepository.findRoleByName('user');

    const newUser = await this.userRepository.create({
      ...data,
      avatarId: imageKitFile.fileId,
      status: UserStatus[data.status.toUpperCase()],
      password,
    });

    await this.userRoleRepository.create(newUser.id, userRole.id);
    await this.imageKitService.updateRelatedId(newUser.avatarId, newUser.id);

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
    this.logger.log(`UserService.getDataPagination: ${JSON.stringify(paging)}`);
    const users = await this.userRepository.pagination(paging);

    const avatarIds = users.map((user) => user.avatarId);
    const avatarUsers =
      await this.imageKitService.getManyImageUrlByFileId(avatarIds);

    return users.map((user) => {
      const avatarUser = avatarUsers.find(
        (avatar) => user.avatarId === avatar.fileId,
      );

      return {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        username: user.username,
        avatarUrl: avatarUser.url,
      };
    });
  }

  async getUserById(userId: number): Promise<any> {
    this.logger.log(`UserService.getUserById: ${userId}`);
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new BadRequestException(
        this.langService.t('exception.not_found', {
          label: 'User',
        }),
      );
    }

    const avatarUrl = await this.imageKitService.getImageUrl(user.avatarId);

    return {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      username: user.username,
      avatarUrl,
    };
  }

  async getCountDataPagination(paging: Pagination): Promise<number> {
    this.logger.log(
      `UserService.getTotalDataPagination: ${JSON.stringify(paging)}`,
    );

    return await this.userRepository.paginationCount(paging);
  }

  async update(
    data: UpdateUserDto,
    userId: number,
  ): Promise<UpdateUserResponseDto> {
    this.logger.log(`UserService.update: ${JSON.stringify(data)}`);
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException(
        this.langService.t('exception.not_found', {
          label: 'User',
        }),
      );
    }

    const updatedUser = await this.userRepository.update(userId, data);

    return {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      phone: updatedUser.phone,
      email: updatedUser.email,
      username: updatedUser.username,
    };
  }

  async updateAvatar(
    data: UpdateAvatarDto,
    userId: number,
  ): Promise<UpdateAvatarResponse> {
    this.logger.log(`UserService.updateAvatar: ${JSON.stringify(data)}`);

    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException(
        this.langService.t('exception.not_found', {
          label: 'User',
        }),
      );
    }

    await this.imageKitService.deleteFile(user.avatarId);

    const imageKitResponse = await this.imageKitService.uploadFile(
      data.avatar,
      FOLDER_IMAGEKIT.AVATAR,
    );

    await this.userRepository.update(userId, {
      avatarId: imageKitResponse.fileId,
    });

    return imageKitResponse.url;
  }

  async delete(userId: number) {
    this.logger.log(`UserService.delete: ${JSON.stringify(userId)}`);
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException(
        this.langService.t('exception.not_found', {
          label: 'User',
        }),
      );
    }

    const deletedUser = await this.userRepository.delete(userId);

    return {
      id: deletedUser.id,
      fullName: deletedUser.fullName,
      username: deletedUser.username,
    };
  }

  async deleteMany(userIds: number[]) {
    this.logger.log(`UserService.deleteMany: ${JSON.stringify(userIds)}`);
    const users = await this.userRepository.findManyBasedOnColumn(
      'id',
      userIds,
    );

    if (users.length !== userIds.length) {
      throw new NotFoundException(
        this.langService.t('exception.not_found', {
          label: 'Some user',
        }),
      );
    }

    return await this.userRepository.deleteMany(userIds);
  }
}
