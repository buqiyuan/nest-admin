import type { IncomingMessage } from 'node:http'

import { getIp } from './ip.util'

function request(headers: IncomingMessage['headers'], extra: { ip?: string, remoteAddress?: string } = {}) {
  return {
    headers,
    ip: extra.ip,
    socket: { remoteAddress: extra.remoteAddress },
  } as IncomingMessage & { ip?: string }
}

describe('getIp', () => {
  it('reads the first address in x-forwarded-for', () => {
    expect(getIp(request({ 'x-forwarded-for': '203.0.113.5, 10.0.0.1' }))).toBe('203.0.113.5')
  })

  it('falls back to req.ip and then the socket address', () => {
    expect(getIp(request({}, { ip: '198.51.100.8' }))).toBe('198.51.100.8')
    expect(getIp(request({}, { remoteAddress: '127.0.0.1' }))).toBe('127.0.0.1')
  })
})
