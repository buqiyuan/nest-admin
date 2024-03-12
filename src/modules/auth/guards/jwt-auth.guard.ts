import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'
import { isEmpty, isNil } from 'lodash'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { ErrorEnum } from '~/constants/error-code.constant'
import { AuthService } from '~/modules/auth/auth.service'

import { checkIsDemoMode } from '~/utils'

import { AuthStrategy, PUBLIC_KEY } from '../auth.constant'
import { TokenService } from '../services/token.service'

// https://docs.nestjs.com/recipes/passport#implement-protected-route-and-jwt-strategy-guards
@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthStrategy.JWT) {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    // const response = context.switchToHttp().getResponse<FastifyReply>()

    // TODO 此处代码的作用是判断如果在演示环境下，则拒绝用户的增删改操作，去掉此代码不影响正常的业务逻辑
    if (request.method !== 'GET' && !request.url.includes('/auth/login'))
      checkIsDemoMode()

    const isSse = request.headers.accept === 'text/event-stream'

    if (isSse && !request.headers.authorization?.startsWith('Bearer ')) {
      const { token } = request.query as Record<string, string>
      if (token)
        request.headers.authorization = `Bearer ${token}`
    }

    const Authorization = request.headers.authorization

    let result: any = false
    try {
      result = await super.canActivate(context)
    }
    catch (e) {
      // 需要后置判断 这样携带了 token 的用户就能够解析到 request.user
      if (isPublic)
        return true

      if (isEmpty(Authorization))
        throw new UnauthorizedException('未登录')

      // 判断 token 是否存在, 如果不存在则认证失败
      const accessToken = isNil(Authorization)
        ? undefined
        : await this.tokenService.checkAccessToken(Authorization!)

      if (!accessToken)
        throw new BusinessException(ErrorEnum.INVALID_LOGIN)
    }

    // SSE 请求
    if (isSse) {
      const { uid } = request.params as Record<string, any>

      if (Number(uid) !== request.user.uid)
        throw new UnauthorizedException('路径参数 uid 与当前 token 登录的用户 uid 不一致')
    }

    const pv = await this.authService.getPasswordVersionByUid(request.user.uid)
    if (pv !== `${request.user.pv}`) {
      // 密码版本不一致，登录期间已更改过密码
      throw new BusinessException(ErrorEnum.INVALID_LOGIN)
    }

    // 不允许多端登录
    // const cacheToken = await this.authService.getTokenByUid(request.user.uid);
    // if (Authorization !== cacheToken) {
    //   // 与redis保存不一致 即二次登录
    //   throw new ApiException(ErrorEnum.CODE_1106);
    // }

    return result
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user)
      throw err || new UnauthorizedException()

    return user
  }
}
