import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '@common/constants/role.constant';
import { UserRole } from '@common/types/user-role.type';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
