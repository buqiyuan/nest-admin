import { requestPathname } from './request.util'

describe('requestPathname', () => {
  it('drops the query string', () => {
    expect(requestPathname({ url: '/api/auth/login?redirect=/home' })).toBe('/api/auth/login')
  })

  it('keeps a path without a query', () => {
    expect(requestPathname({ url: '/api/auth/captcha/img' })).toBe('/api/auth/captcha/img')
    expect(requestPathname({})).toBe('')
  })
})
