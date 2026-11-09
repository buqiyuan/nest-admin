/** 去掉查询串的请求路径。不依赖 Fastify 的 routeOptions。 */
export function requestPathname(request: { url?: string | null }): string {
  const url = request.url ?? ''
  const queryIndex = url.indexOf('?')
  return queryIndex === -1 ? url : url.slice(0, queryIndex)
}
