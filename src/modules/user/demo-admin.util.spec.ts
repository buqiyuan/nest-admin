import { ForbiddenException } from '@nestjs/common'

import { ROOT_USER_ID } from '~/constants/system.constant'

import { UserStatus } from './constant'
import {
  assertDemoAdminAccountProtected,
  assertDemoAdminProfileChange,
  BUILTIN_ADMIN_USERNAME,
  DEMO_ADMIN_ACCOUNT_MESSAGE,
  isBuiltInAdminAccount,
  isDemoAdminProtectionEnabled,
} from './demo-admin.util'

const MESSAGE = '演示环境不允许修改管理员账号或密码'

describe('demo admin credential guard', () => {
  const previous = new Map<string, string | undefined>()

  beforeEach(() => {
    for (const key of ['DEMO_MODE', 'IS_DEMO']) {
      previous.set(key, process.env[key])
      delete process.env[key]
    }
  })

  afterEach(() => {
    for (const key of ['DEMO_MODE', 'IS_DEMO']) {
      const value = previous.get(key)
      if (typeof value === 'undefined')
        delete process.env[key]
      else
        process.env[key] = value
    }
  })

  it('uses the documented Chinese error', () => {
    expect(DEMO_ADMIN_ACCOUNT_MESSAGE).toBe(MESSAGE)
  })

  it('recognizes the seeded admin by id or username', () => {
    expect(isBuiltInAdminAccount({ id: ROOT_USER_ID, username: 'renamed' })).toBe(true)
    expect(isBuiltInAdminAccount({ id: '1', username: 'renamed' })).toBe(true)
    expect(isBuiltInAdminAccount({ id: 9, username: BUILTIN_ADMIN_USERNAME })).toBe(true)
    expect(isBuiltInAdminAccount({ id: 2, username: 'user' })).toBe(false)
    expect(isBuiltInAdminAccount({ id: 2, username: 'Admin' })).toBe(false)
    expect(isBuiltInAdminAccount(null)).toBe(false)
    expect(isBuiltInAdminAccount(undefined)).toBe(false)
  })

  it.each([
    undefined,
    'false',
    'FALSE',
    '0',
    '  false  ',
    '"false"',
    '\'false\'',
  ])('stays off when DEMO_MODE is %p and IS_DEMO is unset', (value) => {
    if (typeof value !== 'undefined')
      process.env.DEMO_MODE = value

    expect(isDemoAdminProtectionEnabled()).toBe(false)
    expect(() => assertDemoAdminAccountProtected({ id: 1, username: 'admin' })).not.toThrow()
    expect(() => assertDemoAdminProfileChange(
      { id: 1, username: 'admin' },
      { username: 'root', password: 'b123456', status: UserStatus.Disable },
    )).not.toThrow()
  })

  it('turns on when either DEMO_MODE or IS_DEMO is true', () => {
    process.env.DEMO_MODE = 'true'
    expect(isDemoAdminProtectionEnabled()).toBe(true)

    delete process.env.DEMO_MODE
    process.env.IS_DEMO = '1'
    expect(isDemoAdminProtectionEnabled()).toBe(true)

    process.env.DEMO_MODE = 'false'
    process.env.IS_DEMO = 'true'
    expect(isDemoAdminProtectionEnabled()).toBe(true)
  })

  it('blocks credential changes for the built-in admin only while the flag is on', () => {
    process.env.DEMO_MODE = 'true'

    expect(() => assertDemoAdminAccountProtected({ id: 1, username: 'admin' })).toThrow(ForbiddenException)
    expect(() => assertDemoAdminAccountProtected({ id: 1, username: 'admin' })).toThrow(MESSAGE)
    expect(() => assertDemoAdminAccountProtected({ id: 2, username: 'user' })).not.toThrow()

    const admin = { id: 1, username: 'admin' }
    expect(() => assertDemoAdminProfileChange(admin, {})).not.toThrow()
    expect(() => assertDemoAdminProfileChange(admin, { username: 'admin', password: '', status: UserStatus.Enabled })).not.toThrow()
    expect(() => assertDemoAdminProfileChange(admin, { username: 'root' })).toThrow(MESSAGE)
    expect(() => assertDemoAdminProfileChange(admin, { username: null })).toThrow(MESSAGE)
    expect(() => assertDemoAdminProfileChange(admin, { password: 'b123456' })).toThrow(MESSAGE)
    expect(() => assertDemoAdminProfileChange(admin, { status: UserStatus.Disable })).toThrow(MESSAGE)
    expect(() => assertDemoAdminProfileChange(admin, { status: '0' })).toThrow(MESSAGE)
    expect(() => assertDemoAdminProfileChange({ id: 8, username: 'developer' }, {
      username: 'developer2',
      password: 'b123456',
      status: UserStatus.Disable,
    })).not.toThrow()
  })
})
