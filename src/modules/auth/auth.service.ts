// NestJs
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Repository
import { RoleRepository } from './repositories/role.repository';
import { UserRepository } from './repositories/user.repository';
import { UserRoleRepository } from './repositories/user-role.repository';

// DTO
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

// Lib
import { PasswordService } from '@lib/password.service';
import { WinstonLoggerService } from '@lib/winston-logger.service';
import { ImageKitService } from '@lib/image-kit.service';

// Common
import { JwtPayload } from '@common/types/jwt-payload.type';
import { UserStatus } from '@common/types/user-status.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly roleRepository: RoleRepository,
    private readonly logger: WinstonLoggerService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly imageKitService: ImageKitService,
  ) {}

  async register(data: RegisterDto): Promise<RegisterResponseDto> {
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

  async login(data: LoginDto): Promise<LoginResponseDto> {
    this.logger.log(`AuthService.login: ${data}`);

    const user = await this.userRepository.findUserByEmailOrUsername(
      data.username,
    );

    if (!user) {
      throw new HttpException(
        'Username or password is not correct.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const comparedPassword = await this.passwordService.comparePassword(
      data.password,
      user.password,
    );

    if (!comparedPassword) {
      throw new HttpException(
        'Username or password is not correct.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userRole = await this.userRoleRepository.findUserRoleByUserId(
      user.id,
    );
    const role = await this.roleRepository.findRoleById(userRole.roleId);

    const tokenPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: role.name,
    };

    const authToken = await this.jwtService.signAsync(tokenPayload);
    const refreshToken = await this.jwtService.signAsync(tokenPayload);

    return {
      userData: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        phone: user.phone,
        role: role.name,
      },
      authToken,
      refreshToken,
    };
  }
}
