import type { IRedisConfig } from '~/config'

/** 给 @keyv/redis 用的连接串。密码为空时不带鉴权段。 */
export function buildRedisUrl(config: IRedisConfig): string {
  const auth = config.password ? `:${encodeURIComponent(config.password)}@` : ''
  const db = config.db ?? 0
  return `redis://${auth}${config.host}:${config.port}/${db}`
}
