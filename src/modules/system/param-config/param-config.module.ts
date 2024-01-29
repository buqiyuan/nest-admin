import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ParamConfigController } from './param-config.controller'
import { ParamConfigEntity } from './param-config.entity'
import { ParamConfigService } from './param-config.service'

const services = [ParamConfigService]

@Module({
  imports: [TypeOrmModule.forFeature([ParamConfigEntity])],
  controllers: [ParamConfigController],
  providers: [...services],
  exports: [TypeOrmModule, ...services],
})
export class ParamConfigModule {}
