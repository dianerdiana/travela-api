import { Injectable, Post, UseGuards } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { WinstonLoggerService } from '@core/logger/winston-logger.service';
import { JwtAuthGuard } from '@core/guards/auth.guard';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    logger: WinstonLoggerService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(data) {
    return await this.userRepository.create(data);
  }
}
