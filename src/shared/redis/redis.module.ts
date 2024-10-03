import { RedisModule as NestRedisModule, RedisService } from '@liaoliaots/nestjs-redis'
import { CacheModule } from '@nestjs/cache-manager'
import { Global, Module, Provider } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { redisStore } from 'cache-manager-ioredis-yet'
import { RedisOptions } from 'ioredis'

import { REDIS_CLIENT } from '~/common/decorators/inject-redis.decorator'

import { ConfigKeyPaths, IRedisConfig } from '~/config'
import { CacheService } from './cache.service'
import { REDIS_PUBSUB } from './redis.constant'
import { RedisSubPub } from './redis-subpub'
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
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigKeyPaths>) => {
        const redisOptions: RedisOptions = configService.get<IRedisConfig>('redis')

        return {
          isGlobal: true,
          store: redisStore,
          isCacheableValue: () => true,
          ...redisOptions,
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
