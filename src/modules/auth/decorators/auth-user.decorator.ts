import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { NodeRequest } from '@nestjs/platform-node'

type Payload = keyof IAuthUser

/**
 * @description 获取当前登录用户信息, 并挂载到request上
 */
export const AuthUser = createParamDecorator(
  (data: Payload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<NodeRequest>()
    // auth guard will mount this
    const user = request.user as IAuthUser

    return data ? user?.[data] : user
  },
)
