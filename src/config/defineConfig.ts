import { conf } from 'qiniu';
import { LoggerModuleOptions as LoggerConfigOptions } from 'src/shared/logger/logger.interface';
import { LoggerOptions } from 'typeorm';

/**
 * 用于智能提示
 */
export function defineConfig(config: IConfig): IConfig {
  return config;
}

/**
 * sf-admin 配置
 */
export interface IConfig {
  /**
   * 管理员角色ID，一旦分配，该角色下分配的管理员都为超级管理员
   */
  rootRoleId?: number;
  /**
   * 用户鉴权Token密钥
   */
  jwt?: JwtConfigOptions;
  /**
   * Mysql数据库配置
   */
  database?: DataBaseConfigOptions;
  /**
   * Redis配置
   */
  redis?: RedisConfigOptions;
  /**
   * 七牛云配置
   */
  qiniu?: QiniuConfigOptions;
  /**
   * 应用级别日志配置
   */
  logger?: LoggerConfigOptions;
  /**
   * Swagger文档配置
   */
  swagger?: SwaggerConfigOptions;
}

//--------- config interface ------------

export interface JwtConfigOptions {
  secret: string;
}

export interface QiniuConfigOptions {
  accessKey?: string;
  secretKey?: string;
  bucket?: string;
  zone?: conf.Zone;
  domain?: string;
  access?: string;
}

export interface RedisConfigOptions {
  host?: string;
  port?: number | string;
  password?: string;
  db?: number;
}

export interface DataBaseConfigOptions {
  type?: string;
  host?: string;
  port?: number | string;
  username?: string;
  password?: string;
  database?: string;
  synchronize?: boolean;
  logging?: LoggerOptions;
}

export interface SwaggerConfigOptions {
  enable?: boolean;
  path?: string;
  title?: string;
  desc?: string;
  version?: string;
}
