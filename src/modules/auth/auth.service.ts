import { RoleRepository } from './repositories/role.repository';
import {
  HttpException,
  HttpStatus,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { RegisterDto, RegisterResponseDto } from './dto/register.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { UserRoleRepository } from './repositories/user-role.repository';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '@common/services/password.service';
import { JwtPayload } from '@common/types/jwt-payload.type';
import { UserStatus } from '@common/constants/user-status';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private userRoleRepository: UserRoleRepository,
    private roleRepository: RoleRepository,
    private logger: LoggerService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}

  async register(data: RegisterDto): Promise<RegisterResponseDto> {
    this.logger.log(`AuthService.register: ${data}`);

    const password = await this.passwordService.hashPassword(data.password);
    const userRole = await this.roleRepository.findRoleByName('user');

    const newUser = await this.userRepository.register({
      ...data,
      password,
      status: UserStatus.Active,
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
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      phone: user.phone,
      role: role.name,
      authToken,
      refreshToken,
    };
  }
}
