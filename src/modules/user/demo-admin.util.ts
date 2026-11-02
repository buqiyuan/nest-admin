import { ForbiddenException } from '@nestjs/common'

import { ROOT_USER_ID } from '~/constants/system.constant'
import { envBoolean } from '~/global/env'

import { UserStatus } from './constant'

/** 种子数据里的内置超级管理员用户名 */
export const BUILTIN_ADMIN_USERNAME = 'admin'

/** 演示环境拒绝改内置管理员凭证时返回的文案 */
export const DEMO_ADMIN_ACCOUNT_MESSAGE = '演示环境不允许修改管理员账号或密码'

export interface DemoAdminAccount {
  id?: number | string | null
  username?: string | null
}

export interface DemoAdminProfileChange {
  username?: string | null
  password?: string | null
  status?: number | string | null
}

/**
 * 公开演示是否要锁住内置管理员凭证。
 * `DEMO_MODE` 只锁管理员账号；`IS_DEMO` 仍会在守卫里拒绝其它写请求，同时也会打开这层锁定。
 * 两个变量都未设置，或为 false / 0 时，不改变原有行为。
 */
export function isDemoAdminProtectionEnabled(): boolean {
  return envBoolean('DEMO_MODE') || envBoolean('IS_DEMO')
}

/** 内置管理员：种子用户 id，或用户名仍为 admin */
export function isBuiltInAdminAccount(user?: DemoAdminAccount | null): boolean {
  if (!user)
    return false

  if (user.id != null && user.id !== '' && Number(user.id) === ROOT_USER_ID)
    return true

  return user.username === BUILTIN_ADMIN_USERNAME
}

/** 密码修改、删除等必然改动或作废内置管理员账号的操作 */
export function assertDemoAdminAccountProtected(user?: DemoAdminAccount | null): void {
  if (isDemoAdminProtectionEnabled() && isBuiltInAdminAccount(user))
    throw new ForbiddenException(DEMO_ADMIN_ACCOUNT_MESSAGE)
}

/**
 * 用户资料更新。只拦截用户名、密码和禁用；昵称等其它字段保持可改。
 * 未提交的字段（undefined）以及空密码视为本次没有改凭证。
 */
export function assertDemoAdminProfileChange(
  user: DemoAdminAccount | null | undefined,
  change: DemoAdminProfileChange,
): void {
  if (!isDemoAdminProtectionEnabled() || !isBuiltInAdminAccount(user) || !user)
    return

  const passwordChanged = typeof change.password === 'string' && change.password.length > 0
  const usernameChanged = change.username !== undefined && change.username !== user.username
  const disabled = change.status === UserStatus.Disable || change.status === '0'

  if (passwordChanged || usernameChanged || disabled)
    throw new ForbiddenException(DEMO_ADMIN_ACCOUNT_MESSAGE)
}
