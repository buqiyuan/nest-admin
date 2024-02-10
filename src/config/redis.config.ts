import { ConfigType, registerAs } from '@nestjs/config'

import { env, envNumber } from '~/global/env'

export const redisRegToken = 'redis'

export const RedisConfig = registerAs(redisRegToken, () => ({
  host: env('REDIS_HOST', '127.0.0.1'),
  port: envNumber('REDIS_PORT', 6379),
  password: env('REDIS_PASSWORD'),
  db: envNumber('REDIS_DB'),
}))

export type IRedisConfig = ConfigType<typeof RedisConfig>
