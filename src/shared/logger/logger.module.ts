import { DynamicModule, Module } from '@nestjs/common';
import { LOGGER_MODULE_OPTIONS } from './logger.constants';
import {
  LoggerModuleAsyncOptions,
  LoggerModuleOptions,
} from './logger.interface';
import { LoggerService } from './logger.service';

@Module({})
export class LoggerModule {
  static forRoot(
    options: LoggerModuleOptions,
    isGlobal = false,
  ): DynamicModule {
    return {
      global: isGlobal,
      module: LoggerModule,
      providers: [
        LoggerService,
        {
          provide: LOGGER_MODULE_OPTIONS,
          useValue: options,
        },
      ],
      exports: [LoggerService, LOGGER_MODULE_OPTIONS],
    };
  }

  static forRootAsync(
    options: LoggerModuleAsyncOptions,
    isGlobal = false,
  ): DynamicModule {
    return {
      global: isGlobal,
      module: LoggerModule,
      imports: options.imports,
      providers: [
        LoggerService,
        {
          provide: LOGGER_MODULE_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
      ],
      exports: [LoggerService, LOGGER_MODULE_OPTIONS],
    };
  }
}
