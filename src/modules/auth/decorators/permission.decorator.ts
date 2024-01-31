import { SetMetadata, applyDecorators } from '@nestjs/common'

import { PERMISSION_KEY } from '../auth.constant'

export type PermissionValue<T extends string> = `${T}:${string}` | `${T}:${string}:${string}`

export type PermissionMap<T extends string = any, P = Record<string, any>> = {
  [K in keyof P]: P[K] extends string ? `${T}:${P[K]}` : never
}

/** 资源操作需要特定的权限 */
export function Perm(permission: PermissionValue<string> | PermissionValue<string>[]) {
  return applyDecorators(SetMetadata(PERMISSION_KEY, permission))
}

let permissions: string[] = []
/** 定义权限，同时收集所有被定义的权限 */
export function definePermission<T extends string, U extends PermissionMap<T>>(_: T, permissionMap: U): U {
  permissions = [...new Set([...permissions, ...Object.values(permissionMap)])]
  return permissionMap
}

/** 获取所有通过 definePermission 定义的权限 */
export const getDefinePermissions = () => permissions
