import { exec } from 'node:child_process'

import { CronJob } from 'cron'

/** 此文件仅供演示时使用 */

const runMigrationGenerate = async function () {
  exec('npm run migration:revert && npm run migration:run', (error, stdout, stderr) => {
    if (!error)
      console.log('操作成功', error)

    else
      console.log('操作失败', error)
  })
}

const job = CronJob.from({
  /** 每天凌晨 4.30 恢复初始数据 */
  cronTime: '30 4 * * *',
  timeZone: 'Asia/Shanghai',
  start: true,
  onTick() {
    runMigrationGenerate()
    console.log('Task executed daily at 4.30 AM:', new Date().toLocaleTimeString())
  },
})
