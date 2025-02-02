import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RoleRepository } from './repositories/role.repository';
import { UserRepository } from './repositories/user.repository';
import { UserRoleRepository } from './repositories/user-role.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepository, UserRoleRepository, RoleRepository],
})
export class AuthModule {}
