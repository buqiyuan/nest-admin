import { Module } from '@nestjs/common';
import { SystemModule } from '../system/system.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [SystemModule],
  controllers: [LoginController],
  providers: [LoginService],
  exports: [LoginService],
})
export class LoginModule {}
