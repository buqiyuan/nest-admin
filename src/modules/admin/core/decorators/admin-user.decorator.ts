import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ADMIN_USER } from '../../admin.constants';

export const AdminUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // auth guard will mount this
    const user = request[ADMIN_USER];

    return data ? user?.[data] : user;
  },
);
