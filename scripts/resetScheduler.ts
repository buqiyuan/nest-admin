import { exec } from 'node:child_process'

import schedule from 'node-schedule'

/** 此文件仅供演示时使用 */

const runMigrationGenerate = async function () {
  exec('pnpm migration:revert && pnpm migration:run', (error, stdout, stderr) => {
    if (!error)
      console.log('操作成功', error)

    else
      console.log('操作失败', error)
  })
}

/** 每天凌晨 4.30 恢复初始数据 */
schedule.scheduleJob('30 4 * * *', () => {
  runMigrationGenerate()
  console.log('Task executed daily at 4.30 AM:', new Date().toLocaleTimeString())
})
