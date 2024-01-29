import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'

import { isArray, isEmpty, isNil } from 'lodash'

import { DataSource, In, Repository } from 'typeorm'

import { BusinessException } from '~/common/exceptions/biz.exception'

import { ErrorEnum } from '~/constants/error-code.constant'

import { PUBLIC_KEY, RESOURCE_KEY, Roles } from '../auth.constant'
import { ResourceObject } from '../decorators/resource.decorator'

@Injectable()
export class ResourceGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const isSse = request.headers.accept === 'text/event-stream'
    // 忽略 sse 请求
    if (isPublic || isSse)
      return true

    const { user } = request

    if (!user)
      return false

    // 如果是检查资源所属，且不是超级管理员，还需要进一步判断是否是自己的数据
    const { entity, condition } = this.reflector.get<ResourceObject>(
      RESOURCE_KEY,
      context.getHandler(),
    ) ?? { entity: null, condition: null }

    if (entity && !user.roles.includes(Roles.ADMIN)) {
      const repo: Repository<any> = this.dataSource.getRepository(entity)

      /**
       * 获取请求中的 items (ids) 验证数据拥有者
       * @param request
       */
      const getRequestItems = (request?: FastifyRequest): number[] => {
        const { params = {}, body = {}, query = {} } = (request ?? {}) as any
        const id = params.id ?? body.id ?? query.id

        if (id)
          return [id]

        const { items } = body
        return !isNil(items) && isArray(items) ? items : []
      }

      const items = getRequestItems(request)
      if (isEmpty(items))
        throw new BusinessException(ErrorEnum.REQUESTED_RESOURCE_NOT_FOUND)

      if (condition)
        return condition(repo, items, user)

      const recordQuery = {
        where: {
          id: In(items),
          user: { id: user.uid },
        },
        relations: ['user'],
      }

      const records = await repo.find(recordQuery)

      if (isEmpty(records))
        throw new BusinessException(ErrorEnum.REQUESTED_RESOURCE_NOT_FOUND)
    }

    return true
  }
}
