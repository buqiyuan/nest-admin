import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthStrategy } from '../auth.constant';

/**
 * 本地认证策略
 */
@Injectable()
export class LocalGuard extends AuthGuard(AuthStrategy.LOCAL) {
  async canActivate(context: ExecutionContext) {
    return true;
  }
}
