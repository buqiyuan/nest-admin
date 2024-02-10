import { Module } from '@nestjs/common'

import { EmailController } from './email.controller'

@Module({
  imports: [],
  controllers: [EmailController],
})
export class EmailModule {}
