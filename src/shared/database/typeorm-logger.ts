import { Logger } from '@nestjs/common'
import { Logger as ITypeORMLogger, LoggerOptions, QueryRunner } from 'typeorm'

export class TypeORMLogger implements ITypeORMLogger {
  private logger = new Logger(TypeORMLogger.name)

  constructor(private options: LoggerOptions) {}

  logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner) {
    if (!this.isEnable('query'))
      return

    const sql
      = query
      + (parameters && parameters.length
        ? ` -- PARAMETERS: ${this.stringifyParams(parameters)}`
        : '')

    this.logger.log(`[QUERY]: ${sql}`)
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    _queryRunner?: QueryRunner,
  ) {
    if (!this.isEnable('error'))
      return

    const sql
      = query
      + (parameters && parameters.length
        ? ` -- PARAMETERS: ${this.stringifyParams(parameters)}`
        : '')

    this.logger.error([`[FAILED QUERY]: ${sql}`, `[QUERY ERROR]: ${error}`])
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    _queryRunner?: QueryRunner,
  ) {
    const sql
      = query
      + (parameters && parameters.length
        ? ` -- PARAMETERS: ${this.stringifyParams(parameters)}`
        : '')

    this.logger.warn(`[SLOW QUERY: ${time} ms]: ${sql}`)
  }

  logSchemaBuild(message: string, _queryRunner?: QueryRunner) {
    if (!this.isEnable('schema'))
      return

    this.logger.log(message)
  }

  logMigration(message: string, _queryRunner?: QueryRunner) {
    if (!this.isEnable('migration'))
      return

    this.logger.log(message)
  }

  log(
    level: 'warn' | 'info' | 'log',
    message: any,
    _queryRunner?: QueryRunner,
  ) {
    if (!this.isEnable(level))
      return

    switch (level) {
      case 'log':
        this.logger.debug(message)
        break
      case 'info':
        this.logger.log(message)
        break
      case 'warn':
        this.logger.warn(message)
        break
      default:
        break
    }
  }

  /**
   * Converts parameters to a string.
   * Sometimes parameters can have circular objects and therefor we are handle this case too.
   */
  private stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters)
    }
    catch (error) {
      // most probably circular objects in parameters
      return parameters
    }
  }

  /**
   * check enbale log
   */
  private isEnable(
    level: 'query' | 'schema' | 'error' | 'warn' | 'info' | 'log' | 'migration',
  ): boolean {
    return (
      this.options === 'all'
      || this.options === true
      || (Array.isArray(this.options) && this.options.includes(level))
    )
  }
}
