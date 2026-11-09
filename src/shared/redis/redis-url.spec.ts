import { buildRedisUrl } from './redis-url'

describe('buildRedisUrl', () => {
  it('omits auth when password is empty', () => {
    expect(buildRedisUrl({ host: '127.0.0.1', port: 6379, password: '', db: 0 })).toBe('redis://127.0.0.1:6379/0')
  })

  it('encodes the password and keeps the database index', () => {
    expect(buildRedisUrl({ host: 'redis.internal', port: 6380, password: 'p@ss', db: 2 }))
      .toBe('redis://:p%40ss@redis.internal:6380/2')
  })
})
