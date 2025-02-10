import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleRepository } from './repository/role.repository';
import { UserRoleRepository } from './repository/user-role.repository';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, RoleRepository, UserRoleRepository, UserRepository],
})
export class UserModule {}
