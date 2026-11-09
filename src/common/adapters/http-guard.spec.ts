import type { IncomingMessage, ServerResponse } from 'node:http'
import { EventEmitter } from 'node:events'

import { legacyHttpGuard } from './http-guard'

function run(url: string, headers: IncomingMessage['headers'] = {}) {
  const req = { url, headers: { ...headers } } as IncomingMessage
  const res = new EventEmitter() as ServerResponse
  res.statusCode = 200
  res.statusMessage = ''
  let ended = false
  res.end = (() => {
    ended = true
    return res
  }) as ServerResponse['end']
  let nexted = false
  legacyHttpGuard(req, res, () => {
    nexted = true
  })
  return { req, res, ended, nexted }
}

describe('legacyHttpGuard', () => {
  it('rejects php with 418 and does not continue', () => {
    const { res, ended, nexted } = run('/index.php?x=1')
    expect(res.statusCode).toBe(418)
    expect(ended).toBe(true)
    expect(nexted).toBe(false)
  })

  it('answers favicon and manifest with 204', () => {
    expect(run('/favicon.ico').res.statusCode).toBe(204)
    expect(run('/manifest.json').nexted).toBe(false)
  })

  it('fills a missing origin from host and continues', () => {
    const { req, nexted, ended } = run('/api/auth/login', { host: 'localhost:7001' })
    expect(req.headers.origin).toBe('localhost:7001')
    expect(nexted).toBe(true)
    expect(ended).toBe(false)
  })
})
