import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * 从 Fastify onRequest 钩子迁过来的请求预处理。
 * Node 适配器没有 Fastify 的生命周期钩子，改成 Express 风格的中间件，
 * 在路由匹配之前对所有请求生效。
 */
export function legacyHttpGuard(req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) {
  const url = (req.url ?? '').split('?')[0] ?? ''

  if (url.endsWith('.php')) {
    res.statusCode = 418
    res.statusMessage = 'Eh. PHP is not support on this machine. Yep, I also think PHP is bestest programming language. But for me it is beyond my reach.'
    res.end()
    return
  }

  if (url.endsWith('favicon.ico') || url.endsWith('manifest.json')) {
    res.statusCode = 204
    res.end()
    return
  }

  // 没有 Origin 时用 Host 补上，保持旧适配器对 CORS 预检的处理。
  if (!req.headers.origin && req.headers.host)
    req.headers.origin = req.headers.host

  next()
}
