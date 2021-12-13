import { Injectable } from '@nestjs/common';
import { Logger, LoggerOptions } from 'typeorm';
import {
  DEFAULT_SQL_ERROR_LOG_NAME,
  DEFAULT_SQL_SLOW_LOG_NAME,
} from './logger.constants';
import { LoggerModuleOptions } from './logger.interface';
import { LoggerService } from './logger.service';

/**
 * 自定义TypeORM日志，sqlSlow日志及error日志会自动记录至日志文件
 */
@Injectable()
export class TypeORMLoggerService implements Logger {
  /**
   * sql logger
   */
  private logger: LoggerService;

  constructor(
    private options: LoggerOptions,
    private config: LoggerModuleOptions,
  ) {
    this.logger = new LoggerService(TypeORMLoggerService.name, {
      level: 'warn',
      consoleLevel: 'verbose',
      appLogName: DEFAULT_SQL_SLOW_LOG_NAME,
      errorLogName: DEFAULT_SQL_ERROR_LOG_NAME,
      timestamp: this.config.timestamp,
      dir: this.config.dir,
      maxFileSize: this.config.maxFileSize,
      maxFiles: this.config.maxFiles,
    });
  }

  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[]) {
    if (
      this.options === 'all' ||
      this.options === true ||
      (Array.isArray(this.options) && this.options.indexOf('query') !== -1)
    ) {
      const sql =
        query +
        (parameters && parameters.length
          ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
          : '');
      this.logger.verbose('[QUERY]: ' + sql);
    }
  }

  /**
   * Logs query that is failed.
   */
  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    if (
      this.options === 'all' ||
      this.options === true ||
      (Array.isArray(this.options) && this.options.indexOf('error') !== -1)
    ) {
      const sql =
        query +
        (parameters && parameters.length
          ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
          : '');
      this.logger.error([`[FAILED QUERY]: ${sql}`, `[QUERY ERROR]: ${error}`]);
    }
  }

  /**
   * Logs query that is slow.
   */
  logQuerySlow(time: number, query: string, parameters?: any[]) {
    const sql =
      query +
      (parameters && parameters.length
        ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
        : '');
    this.logger.warn(`[SLOW QUERY: ${time} ms]: ` + sql);
  }

  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string) {
    if (
      this.options === 'all' ||
      (Array.isArray(this.options) && this.options.indexOf('schema') !== -1)
    ) {
      this.logger.verbose(message);
    }
  }

  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string) {
    this.logger.verbose(message);
  }

  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(level: 'log' | 'info' | 'warn', message: any) {
    switch (level) {
      case 'log':
        if (
          this.options === 'all' ||
          (Array.isArray(this.options) && this.options.indexOf('log') !== -1)
        )
          this.logger.verbose('[LOG]: ' + message);
        break;
      case 'info':
        if (
          this.options === 'all' ||
          (Array.isArray(this.options) && this.options.indexOf('info') !== -1)
        )
          this.logger.log('[INFO]: ' + message);
        break;
      case 'warn':
        if (
          this.options === 'all' ||
          (Array.isArray(this.options) && this.options.indexOf('warn') !== -1)
        )
          this.logger.warn('[WARN]: ' + message);
        break;
    }
  }

  /**
   * Converts parameters to a string.
   * Sometimes parameters can have circular objects and therefor we are handle this case too.
   */
  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      // most probably circular objects in parameters
      return parameters;
    }
  }
}
