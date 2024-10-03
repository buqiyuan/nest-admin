import { SetMetadata } from '@nestjs/common'

import { IdempotenceOption } from '../interceptors/idempotence.interceptor'

export const HTTP_IDEMPOTENCE_KEY = Symbol('__idempotence_key__')
export const HTTP_IDEMPOTENCE_OPTIONS = Symbol('__idempotence_options__')

/**
 * 幂等
 */
export function Idempotence(options?: IdempotenceOption): MethodDecorator {
  return function (target, key, descriptor: PropertyDescriptor) {
    SetMetadata(HTTP_IDEMPOTENCE_OPTIONS, options || {})(descriptor.value)
  }
}
