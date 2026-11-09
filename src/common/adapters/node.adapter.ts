import { NodeAdapter } from '@nestjs/platform-node'
import cookieParser from 'cookie-parser'
import qs from 'qs'

import { legacyHttpGuard } from './http-guard'

/**
 * Node 适配器默认 JSON 上限是 100kb（与 Express 相同）。
 * 本项目原先跑在 Fastify 上，Fastify 的默认是 1MiB。保持 1mb，避免管理端较大的 JSON 被突然拒绝。
 */
export const BODY_PARSER_LIMIT = '1mb'

/**
 * 只用于签名 cookie，不参与登录鉴权。旧 Fastify cookie 插件用的是同一个固定值。
 * 需要轮换时设置 COOKIE_SECRET，未设置则保持原值，避免已签发的签名 cookie 全部失效。
 */
export const COOKIE_SECRET = process.env.COOKIE_SECRET || 'cookie-secret'

/**
 * 自 NestJS 12.3 起官方推荐的 HTTP 适配器：直接跑在 node:http 上。
 * trustProxy 与旧 Fastify `trustProxy: true` 一致，登录日志里的 IP 继续读 X-Forwarded-For。
 * 只信任自己的反向代理；进程能被客户端直连时，客户端可以伪造该头。
 * querystringParser 用 qs，替代原来在 TransformInterceptor 里改写 req.query 的做法，
 * 守卫和控制器看到的都是同一份嵌套查询对象。
 */
export const nodeAdapter = new NodeAdapter({
  trustProxy: true,
  querystringParser: str => qs.parse(str),
})

nodeAdapter.use(legacyHttpGuard)
nodeAdapter.use(cookieParser(COOKIE_SECRET))
