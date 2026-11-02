import { ForbiddenException } from '@nestjs/common'

import { BusinessException } from '~/common/exceptions/biz.exception'
import { md5 } from '~/utils'

import { DEMO_ADMIN_ACCOUNT_MESSAGE } from './demo-admin.util'
import { UserService } from './user.service'

const MESSAGE = '演示环境不允许修改管理员账号或密码'

function createService() {
  const userRepository = {
    findOneBy: jest.fn(),
    findBy: jest.fn(),
    update: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
  }
  const entityManager = {
    transaction: jest.fn().mockResolvedValue(undefined),
  }
  const redis = {
    get: jest.fn().mockResolvedValue(''),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
  }
  const service = new UserService(
    redis as any,
    userRepository as any,
    {} as any,
    entityManager as any,
    {} as any,
    {} as any,
  )

  return { service, userRepository, entityManager, redis }
}

describe('userService demo admin credentials', () => {
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

  it('still lets admin change password when demo protection is off', async () => {
    const { service, userRepository } = createService()
    const salt = 'salt'
    userRepository.findOneBy.mockResolvedValue({
      id: 1,
      username: 'admin',
      psalt: salt,
      password: md5(`a123456${salt}`),
    })

    await service.updatePassword(1, { oldPassword: 'a123456', newPassword: 'b123456' })

    expect(userRepository.update).toHaveBeenCalledWith(
      { id: 1 },
      { password: md5(`b123456${salt}`) },
    )
  })

  it('rejects self-service password change for admin when DEMO_MODE=true', async () => {
    process.env.DEMO_MODE = 'true'
    const { service, userRepository } = createService()
    userRepository.findOneBy.mockResolvedValue({
      id: 1,
      username: 'admin',
      psalt: 'salt',
      password: 'hashed',
    })

    await expect(service.updatePassword(1, { oldPassword: 'wrong', newPassword: 'b123456' }))
      .rejects
      .toThrow(new ForbiddenException(MESSAGE))
    expect(userRepository.update).not.toHaveBeenCalled()
  })

  it('still lets other users change their own password in demo mode', async () => {
    process.env.DEMO_MODE = 'true'
    const { service, userRepository } = createService()
    const salt = 'salt'
    userRepository.findOneBy.mockResolvedValue({
      id: 2,
      username: 'user',
      psalt: salt,
      password: md5(`a123456${salt}`),
    })

    await service.updatePassword(2, { oldPassword: 'a123456', newPassword: 'b123456' })

    expect(userRepository.update).toHaveBeenCalledWith(
      { id: 2 },
      { password: md5(`b123456${salt}`) },
    )
  })

  it('keeps the old-password check for non-admin users', async () => {
    process.env.DEMO_MODE = 'true'
    const { service, userRepository } = createService()
    userRepository.findOneBy.mockResolvedValue({
      id: 2,
      username: 'user',
      psalt: 'salt',
      password: 'not-the-hash',
    })

    await expect(service.updatePassword(2, { oldPassword: 'a123456', newPassword: 'b123456' }))
      .rejects
      .toBeInstanceOf(BusinessException)
    expect(userRepository.update).not.toHaveBeenCalled()
  })

  it('rejects admin force password reset from user management', async () => {
    process.env.IS_DEMO = 'true'
    process.env.DEMO_MODE = 'false'
    const { service, userRepository } = createService()
    userRepository.findOneBy.mockResolvedValue({
      id: 1,
      username: 'admin',
      psalt: 'salt',
    })

    await expect(service.forceUpdatePassword(1, 'b123456')).rejects.toThrow(MESSAGE)
    expect(userRepository.update).not.toHaveBeenCalled()
  })

  it('still force-resets a non-admin password when protection is on', async () => {
    process.env.DEMO_MODE = 'true'
    const { service, userRepository } = createService()
    const salt = 'salt'
    userRepository.findOneBy.mockResolvedValue({
      id: 8,
      username: 'developer',
      psalt: salt,
    })

    await service.forceUpdatePassword(8, 'b123456')

    expect(userRepository.update).toHaveBeenCalledWith(
      { id: 8 },
      { password: md5(`b123456${salt}`) },
    )
  })

  it('rejects admin username, password, and disable updates, but allows other fields', async () => {
    process.env.DEMO_MODE = 'true'
    const admin = { id: 1, username: 'admin' }

    const username = createService()
    username.userRepository.findOneBy.mockResolvedValue(admin)
    await expect(username.service.update(1, { username: 'root' })).rejects.toThrow(MESSAGE)
    expect(username.entityManager.transaction).not.toHaveBeenCalled()

    const password = createService()
    password.userRepository.findOneBy.mockResolvedValue(admin)
    await expect(password.service.update(1, { password: 'b123456' })).rejects.toThrow(MESSAGE)
    expect(password.entityManager.transaction).not.toHaveBeenCalled()

    const disable = createService()
    disable.userRepository.findOneBy.mockResolvedValue(admin)
    await expect(disable.service.update(1, { status: 0 })).rejects.toThrow(MESSAGE)
    expect(disable.entityManager.transaction).not.toHaveBeenCalled()

    const profile = createService()
    profile.userRepository.findOneBy.mockResolvedValue(admin)
    await profile.service.update(1, { username: 'admin', nickname: 'bqy', password: '' })
    expect(profile.entityManager.transaction).toHaveBeenCalled()

    const renamed = createService()
    renamed.userRepository.findOneBy.mockResolvedValue({ id: 9, username: 'admin' })
    await expect(renamed.service.update(9, { username: 'other' })).rejects.toThrow(DEMO_ADMIN_ACCOUNT_MESSAGE)
  })

  it('does not query or block admin profile updates when the flag is off', async () => {
    const { service, userRepository, entityManager } = createService()

    await service.update(1, { username: 'root', password: 'b123456', status: 0 })

    expect(userRepository.findOneBy).not.toHaveBeenCalled()
    expect(entityManager.transaction).toHaveBeenCalled()
  })

  it('rejects deleting the built-in admin in demo mode', async () => {
    process.env.DEMO_MODE = 'true'
    const byId = createService()
    await expect(byId.service.delete([1, 2])).rejects.toThrow(new ForbiddenException(MESSAGE))
    expect(byId.userRepository.delete).not.toHaveBeenCalled()
    expect(byId.userRepository.findBy).not.toHaveBeenCalled()

    const byName = createService()
    byName.userRepository.findBy.mockResolvedValue([{ id: 9, username: 'admin' }])
    await expect(byName.service.delete([9])).rejects.toThrow(MESSAGE)
    expect(byName.userRepository.delete).not.toHaveBeenCalled()
  })

  it('still deletes a normal user in demo mode and keeps the root-user error when demo mode is off', async () => {
    process.env.DEMO_MODE = 'true'
    const demo = createService()
    demo.userRepository.findBy.mockResolvedValue([{ id: 2, username: 'user' }])
    demo.userRepository.findOneBy.mockResolvedValue({ id: 1 })

    await demo.service.delete([2])

    expect(demo.userRepository.delete).toHaveBeenCalledWith([2])

    delete process.env.DEMO_MODE
    const normal = createService()
    normal.userRepository.findOneBy.mockResolvedValue({ id: 1 })

    await expect(normal.service.delete([1])).rejects.toThrow('不能删除root用户!')
    expect(normal.userRepository.delete).not.toHaveBeenCalled()
    expect(normal.userRepository.findBy).not.toHaveBeenCalled()
  })
})
