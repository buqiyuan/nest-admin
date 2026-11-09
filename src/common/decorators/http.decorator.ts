import type { ExecutionContext } from '@nestjs/common'

import type { NodeRequest } from '@nestjs/platform-node'
import { createParamDecorator } from '@nestjs/common'

import { getIp } from '~/utils/ip.util'
import { requestPathname } from '~/utils/request.util'

/**
 * 快速获取IP
 */
export const Ip = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<NodeRequest>()
  return getIp(request)
})

/**
 * 请求路径，不含查询串。
 * Node 适配器没有 Fastify 的 routeOptions.url，也不提供 Express 的 req.route。
 */
export const Uri = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<NodeRequest>()
  return requestPathname(request)
})
