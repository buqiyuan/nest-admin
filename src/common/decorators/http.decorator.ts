import type { ExecutionContext } from '@nestjs/common'

import type { FastifyRequest } from 'fastify'
import { createParamDecorator } from '@nestjs/common'

import { getIp } from '~/utils/ip.util'

/**
 * 快速获取IP
 */
export const Ip = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<FastifyRequest>()
  return getIp(request)
})

/**
 * 快速获取request path，并不包括url params
 */
export const Uri = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<FastifyRequest>()
  return request.routerPath
})
