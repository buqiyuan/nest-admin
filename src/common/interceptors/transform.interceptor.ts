import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { ResOp } from '~/common/model/response.model'

import { BYPASS_KEY } from '../decorators/bypass.decorator'

/**
 * 统一处理返回接口结果，如果不需要则添加 @Bypass 装饰器
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const bypass = this.reflector.get<boolean>(
      BYPASS_KEY,
      context.getHandler(),
    )

    if (bypass)
      return next.handle()

    return next.handle().pipe(
      map((data) => {
        // if (typeof data === 'undefined') {
        //   context.switchToHttp().getResponse().status(HttpStatus.NO_CONTENT);
        //   return data;
        // }

        return new ResOp(HttpStatus.OK, data ?? null)
      }),
    )
  }
}
