import { ModuleMetadata } from '@nestjs/common';
import { LoggerOptions } from 'typeorm';

/**
 * 日志等级
 */
export type WinstonLogLevel = 'info' | 'error' | 'warn' | 'debug' | 'verbose';

export interface TypeORMLoggerOptions {
  options?: LoggerOptions;
}

/**
 * 日志配置，默认按天数进行切割
 */
export interface LoggerModuleOptions {
  /**
   * 日志文件输出
   * 默认只会输出 log 及以上（warn 和 error）的日志到文件中，等级级别如下
   */
  level?: WinstonLogLevel | 'none';

  /**
   * 控制台输出等级
   */
  consoleLevel?: WinstonLogLevel | 'none';

  /**
   * 如果启用，将打印当前和上一个日志消息之间的时间戳（时差）
   */
  timestamp?: boolean;

  /**
   * 生产环境下，默认会关闭终端日志输出，如有需要，可以设置为 false
   */
  disableConsoleAtProd?: boolean;

  /**
   * Maximum size of the file after which it will rotate. This can be a number of bytes, or units of kb, mb, and gb.
   *  If using the units, add 'k', 'm', or 'g' as the suffix. The units need to directly follow the number.
   *  default: 2m
   */
  maxFileSize?: string;

  /**
   * Maximum number of logs to keep. If not set,
   * no logs will be removed. This can be a number of files or number of days. If using days, add 'd' as the suffix.
   * default: 15d
   */
  maxFiles?: string;

  /**
   * 开发环境下日志产出的目录，绝对路径
   * 开发环境下为了避免冲突以及集中管理，日志会打印在项目目录下的 logs 目录
   */
  dir?: string;

  /**
   * 任何 logger 的 .error() 调用输出的日志都会重定向到这里，重点通过查看此日志定位异常，默认文件名为 common-error.%DATE%.log
   * 注意：此文件名可以包含%DATE%占位符
   */
  errorLogName?: string;

  /**
   * 应用相关日志，供应用开发者使用的日志。我们在绝大数情况下都在使用它，默认文件名为 web.%DATE%.log
   * 注意：此文件名可以包含%DATE%占位符
   */
  appLogName?: string;
}

export interface LoggerModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => LoggerModuleOptions;
  inject?: any[];
}
