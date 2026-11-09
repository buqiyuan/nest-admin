import { createKeyv } from '@keyv/redis'
import { RedisModule as NestRedisModule, RedisService } from '@nestjs-labs/nestjs-ioredis'
import { CacheModule } from '@nestjs/cache-manager'
import { Global, Logger, Module, Provider } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { RedisOptions } from 'ioredis'

import { REDIS_CLIENT } from '~/common/decorators/inject-redis.decorator'

import { ConfigKeyPaths, IRedisConfig } from '~/config'
import { CacheService } from './cache.service'
import { RedisSubPub } from './redis-subpub'
import { buildRedisUrl } from './redis-url'
import { REDIS_PUBSUB } from './redis.constant'
import { RedisPubSubService } from './subpub.service'

const providers: Provider[] = [
  CacheService,
  {
    provide: REDIS_PUBSUB,
    useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
      const redisOptions: RedisOptions = configService.get<IRedisConfig>('redis')
      return new RedisSubPub(redisOptions)
    },
    inject: [ConfigService],
  },
  RedisPubSubService,
  {
    provide: REDIS_CLIENT,
    useFactory: (redisService: RedisService) => {
      return redisService.getOrThrow()
    },
    inject: [RedisService], // 注入 RedisService
  },
]

@Global()
@Module({
  imports: [
    // cache
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const redisOptions = configService.get<IRedisConfig>('redis')
        // cache-manager v6 起存储改为 Keyv。官方 Redis 存储是 @keyv/redis（node-redis），
        // 业务侧的 ioredis 连接仍由 @nestjs-labs/nestjs-ioredis 提供。
        const store = createKeyv(buildRedisUrl(redisOptions))
        store.on('error', (err) => {
          Logger.error(err, undefined, 'CacheRedis')
        })

        return {
          stores: [store],
        }
      },
      inject: [ConfigService],
    }),
    // redis
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => ({
        readyLog: true,
        config: configService.get<IRedisConfig>('redis'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers,
  exports: [...providers, CacheModule],
})
export class RedisModule {}
