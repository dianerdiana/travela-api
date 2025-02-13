import { Module } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { RoleRepository } from './role.repository';
import { UserRoleRepository } from './user-role.repository';
import { UserRepository } from './user.repository';

@Module({
  imports: [],
  providers: [CategoryRepository, RoleRepository, UserRoleRepository, UserRepository],
  exports: [CategoryRepository, RoleRepository, UserRoleRepository, UserRepository],
})
export class RepositoryModule {}
