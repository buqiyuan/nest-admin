import { Inject } from '@nestjs/common'

export const REDIS_CLIENT = Symbol('REDIS_CLIENT')

// 自定义 InjectRedis 装饰器
export const InjectRedis = () => Inject(REDIS_CLIENT)
