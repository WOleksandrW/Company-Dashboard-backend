import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ERole } from '../enums/role.enum';
import { User } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { errorCatcher } from 'src/helpers/errorCatcher';
import { EXCEPTION_TAG } from 'src/constants/error-constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ) {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<ERole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles) {
        return true;
      }

      const { user }: { user: User } = context.switchToHttp().getRequest();
      const userEntity = await this.usersService.findOne(user.id);
      
      if (!userEntity || !userEntity.role) {
        throw new ForbiddenException('Access Denied', { description: EXCEPTION_TAG });
      }

      return requiredRoles.some((role) => userEntity.role === role);
    } catch (error) {
      errorCatcher(error, 'Roles guard error', EXCEPTION_TAG);
    }
  }
}
