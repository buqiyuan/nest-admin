import { Module } from '@nestjs/common';
import { LoginModule } from '../login/login.module';
import { SystemModule } from '../system/system.module';
import { AccountController } from './account.controller';

@Module({
  imports: [SystemModule, LoginModule],
  controllers: [AccountController],
})
export class AccountModule {}
