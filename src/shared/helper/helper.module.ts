import { Global, Module, type Provider } from '@nestjs/common'

import { CronService } from './cron.service'
import { QQService } from './qq.service'

const providers: Provider[] = [
  CronService,
  QQService,
]

@Global()
@Module({
  imports: [],
  providers,
  exports: providers,
})
export class HelperModule {}
