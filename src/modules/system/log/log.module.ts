import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../../user/user.module';

import { CaptchaLogEntity } from './entities/captcha-log.entity';
import { LoginLogEntity } from './entities/login-log.entity';
import { TaskLogEntity } from './entities/task-log.entity';
import { LogController } from './log.controller';
import { CaptchaLogService } from './services/captcha-log.service';
import { LoginLogService } from './services/login-log.service';
import { TaskLogService } from './services/task-log.service';

const providers = [LoginLogService, TaskLogService, CaptchaLogService];

@Module({
  imports: [
    TypeOrmModule.forFeature([LoginLogEntity, CaptchaLogEntity, TaskLogEntity]),
    UserModule,
  ],
  controllers: [LogController],
  providers: [...providers],
  exports: [TypeOrmModule, ...providers],
})
export class LogModule {}
