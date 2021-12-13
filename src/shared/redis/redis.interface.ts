import { ModuleMetadata } from '@nestjs/common';
import { Redis, RedisOptions, ClusterNode, ClusterOptions } from 'ioredis';

export interface RedisModuleOptions extends RedisOptions {
  /**
   * muitl client connection, default
   */
  name?: string;

  /**
   * support url
   */
  url?: string;

  /**
   * is cluster
   */
  cluster?: boolean;

  /**
   * cluster node, using cluster is true
   */
  nodes?: ClusterNode[];

  /**
   * cluster options, using cluster is true
   */
  clusterOptions?: ClusterOptions;

  /**
   * callback
   */
  onClientReady?(client: Redis): void;
}

export interface RedisModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | RedisModuleOptions
    | RedisModuleOptions[]
    | Promise<RedisModuleOptions>
    | Promise<RedisModuleOptions[]>;
  inject?: any[];
}
