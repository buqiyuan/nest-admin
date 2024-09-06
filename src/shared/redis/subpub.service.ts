import { Inject, Injectable } from '@nestjs/common'

import { REDIS_PUBSUB } from './redis.constant'
import { RedisSubPub } from './redis-subpub'

@Injectable()
export class RedisPubSubService {
  constructor(@Inject(REDIS_PUBSUB) private readonly redisSubPub: RedisSubPub) {}

  public async publish(event: string, data: any) {
    return this.redisSubPub.publish(event, data)
  }

  public async subscribe(event: string, callback: (data: any) => void) {
    return this.redisSubPub.subscribe(event, callback)
  }

  public async unsubscribe(event: string, callback: (data: any) => void) {
    return this.redisSubPub.unsubscribe(event, callback)
  }
}
