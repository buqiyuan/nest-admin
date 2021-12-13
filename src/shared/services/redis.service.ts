import { Inject, Injectable } from '@nestjs/common';
import { Cluster } from 'cluster';
import { Redis } from 'ioredis';
import {
  REDIS_CLIENT,
  REDIS_DEFAULT_CLIENT_KEY,
} from '../redis/redis.constants';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly clients: Map<string, Redis | Cluster>,
  ) {}

  /**
   * get redis client by name
   * @param name client name
   * @returns Redis Instance
   */
  public getRedis(name = REDIS_DEFAULT_CLIENT_KEY): Redis {
    if (!this.clients.has(name)) {
      throw new Error(`redis client ${name} does not exist`);
    }
    return this.clients.get(name) as Redis;
  }
}
