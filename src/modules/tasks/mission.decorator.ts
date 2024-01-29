import { SetMetadata } from '@nestjs/common'

export const MISSION_DECORATOR_KEY = 'decorator:mission'

/**
 * 定时任务标记，没有该任务标记的任务不会被执行，保证全局获取下的模块被安全执行
 */
export const Mission = () => SetMetadata(MISSION_DECORATOR_KEY, true)
