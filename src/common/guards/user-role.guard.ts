import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@common/constants/role.constant';
import { UserRole } from '@common/types/user-role.type';
import { JwtPayload } from '@common/types/jwt-payload.type';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles from the metadata
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // No roles are required, allow access
    }

    // Get the user from the request
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload; // Assuming the user is attached to the request

    if (!requiredRoles.includes(UserRole[user.role.toUpperCase()])) {
      throw new HttpException(
        "You don't have access to do it.",
        HttpStatus.FORBIDDEN,
      );
    }

    return false;
  }
}
