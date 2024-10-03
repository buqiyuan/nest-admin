import type { Redis } from 'ioredis'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Emitter } from '@socket.io/redis-emitter'
import { Cache } from 'cache-manager'

import { RedisIoAdapterKey } from '~/common/adapters/socket.adapter'

import { API_CACHE_PREFIX } from '~/constants/cache.constant'
import { getRedisKey } from '~/utils/redis.util'

// 获取器
export type TCacheKey = string
export type TCacheResult<T> = Promise<T | undefined>

@Injectable()
export class CacheService {
  private cache!: Cache

  private ioRedis!: Redis
  constructor(@Inject(CACHE_MANAGER) cache: Cache) {
    this.cache = cache
  }

  private get redisClient(): Redis {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    return this.cache.store.client
  }

  public get<T>(key: TCacheKey): TCacheResult<T> {
    return this.cache.get(key)
  }

  public set(key: TCacheKey, value: any, milliseconds: number) {
    return this.cache.set(key, value, milliseconds)
  }

  public getClient() {
    return this.redisClient
  }

  private _emitter: Emitter

  public get emitter(): Emitter {
    if (this._emitter)
      return this._emitter

    this._emitter = new Emitter(this.redisClient, {
      key: RedisIoAdapterKey,
    })

    return this._emitter
  }

  public async cleanCatch() {
    const redis = this.getClient()
    const keys: string[] = await redis.keys(`${API_CACHE_PREFIX}*`)
    await Promise.all(keys.map(key => redis.del(key)))
  }

  public async cleanAllRedisKey() {
    const redis = this.getClient()
    const keys: string[] = await redis.keys(getRedisKey('*'))

    await Promise.all(keys.map(key => redis.del(key)))
  }
}
