import type { ExecutionContext } from '@nestjs/common'
import type { NodeRequest } from '@nestjs/platform-node'
import { createParamDecorator } from '@nestjs/common'

export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<NodeRequest>()
  return data ? request.cookies?.[data] : request.cookies
})
