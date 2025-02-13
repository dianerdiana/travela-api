import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleRepository } from '@repositories/role.repository';
import { UserRoleRepository } from '@repositories/user-role.repository';
import { UserRepository } from '@repositories/user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, RoleRepository, UserRoleRepository, UserRepository],
})
export class UserModule {}
