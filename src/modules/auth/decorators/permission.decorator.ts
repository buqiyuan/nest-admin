import { SetMetadata, applyDecorators } from '@nestjs/common'

import { PERMISSION_KEY } from '../auth.constant'

export type PermissionValue<T extends string> = `${T}:${string}` | `${T}:${string}:${string}`

export type PermissionMap<T extends string = any, U extends string[] = any[]> = {
  [K in U[number]]: PermissionValue<T>;
}

/** 资源操作需要特定的权限 */
export function Perm(permission: PermissionValue<string> | PermissionValue<string>[]) {
  return applyDecorators(SetMetadata(PERMISSION_KEY, permission))
}
