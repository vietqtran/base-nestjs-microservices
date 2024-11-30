import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import RequestWithUser from '../interfaces/request-with-user.interface';

const RoleGuard = (roles: string[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      return user?.roles.some((role) => roles.includes(role));
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
