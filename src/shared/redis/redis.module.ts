import {
  DynamicModule,
  Module,
  OnModuleDestroy,
  Provider,
} from '@nestjs/common';
import IORedis, { Redis, Cluster } from 'ioredis';
import { isEmpty } from 'lodash';
import {
  REDIS_CLIENT,
  REDIS_DEFAULT_CLIENT_KEY,
  REDIS_MODULE_OPTIONS,
} from './redis.constants';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';

@Module({})
export class RedisModule implements OnModuleDestroy {
  static register(
    options: RedisModuleOptions | RedisModuleOptions[],
  ): DynamicModule {
    const clientProvider = this.createAysncProvider();
    return {
      module: RedisModule,
      providers: [
        clientProvider,
        {
          provide: REDIS_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      exports: [clientProvider],
    };
  }

  static registerAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const clientProvider = this.createAysncProvider();
    return {
      module: RedisModule,
      imports: options.imports ?? [],
      providers: [clientProvider, this.createAsyncClientOptions(options)],
      exports: [clientProvider],
    };
  }

  /**
   * create provider
   */
  private static createAysncProvider(): Provider {
    // create client
    return {
      provide: REDIS_CLIENT,
      useFactory: (
        options: RedisModuleOptions | RedisModuleOptions[],
      ): Map<string, Redis | Cluster> => {
        const clients = new Map<string, Redis | Cluster>();
        if (Array.isArray(options)) {
          options.forEach((op) => {
            const name = op.name ?? REDIS_DEFAULT_CLIENT_KEY;
            if (clients.has(name)) {
              throw new Error('Redis Init Error: name must unique');
            }
            clients.set(name, this.createClient(op));
          });
        } else {
          // not array
          clients.set(REDIS_DEFAULT_CLIENT_KEY, this.createClient(options));
        }
        return clients;
      },
      inject: [REDIS_MODULE_OPTIONS],
    };
  }

  /**
   * 创建IORedis实例
   */
  private static createClient(options: RedisModuleOptions): Redis | Cluster {
    const { onClientReady, url, cluster, clusterOptions, nodes, ...opts } =
      options;
    let client = null;
    // check url
    if (!isEmpty(url)) {
      client = new IORedis(url);
    } else if (cluster) {
      // check cluster
      client = new IORedis.Cluster(nodes, clusterOptions);
    } else {
      client = new IORedis(opts);
    }
    if (onClientReady) {
      onClientReady(client);
    }
    return client;
  }

  private static createAsyncClientOptions(options: RedisModuleAsyncOptions) {
    return {
      provide: REDIS_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    };
  }

  onModuleDestroy() {
    // on destroy
  }
}
