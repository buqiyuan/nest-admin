import cluster from 'node:cluster'

import { Cron } from '@nestjs/schedule'

import { isMainProcess } from '~/global/env'

export const CronOnce: typeof Cron = (...rest): MethodDecorator => {
  // If not in cluster mode, and PM2 main worker
  if (isMainProcess)
    // eslint-disable-next-line no-useless-call
    return Cron.call(null, ...rest)

  if (cluster.isWorker && cluster.worker?.id === 1)
    // eslint-disable-next-line no-useless-call
    return Cron.call(null, ...rest)

  const returnNothing: MethodDecorator = () => {}
  return returnNothing
}
