import { assertStrongSecret, MIN_JWT_SECRET_LENGTH, SecurityConfig } from './security.config'

const STRONG_JWT = 'jwt-secret-must-be-at-least-32-characters-long'
const STRONG_REFRESH = 'refresh-secret-must-be-at-least-32-characters'

describe('assertStrongSecret', () => {
  it('accepts a unique secret of at least 32 characters', () => {
    expect(assertStrongSecret('JWT_SECRET', STRONG_JWT)).toBe(STRONG_JWT)
  })

  it('trims whitespace and surrounding quotes', () => {
    expect(assertStrongSecret('JWT_SECRET', `  "${STRONG_JWT}"  `)).toBe(STRONG_JWT)
  })

  it.each([
    undefined,
    null,
    '',
    '   ',
    '""',
    'admin!@#123',
    'admin!@',
    '  admin!@#123  ',
    'ADMIN!@#123',
    'secret',
    'Secret',
    'changeme',
    'change-me',
    'password',
    'a'.repeat(MIN_JWT_SECRET_LENGTH - 1),
  ])('rejects %p', (value) => {
    expect(() => assertStrongSecret('JWT_SECRET', value)).toThrow(/Refusing to start: JWT_SECRET/)
  })

  it('does not include the rejected secret in the error', () => {
    expect.assertions(1)
    try {
      assertStrongSecret('JWT_SECRET', 'admin!@#123')
    }
    catch (error) {
      expect((error as Error).message).not.toContain('admin!@#123')
    }
  })
})

describe('securityConfig', () => {
  const originalJwt = process.env.JWT_SECRET
  const originalRefresh = process.env.REFRESH_TOKEN_SECRET

  afterEach(() => {
    restoreEnv('JWT_SECRET', originalJwt)
    restoreEnv('REFRESH_TOKEN_SECRET', originalRefresh)
  })

  it('refuses to build config when the shipped default is still set', () => {
    process.env.JWT_SECRET = 'admin!@#123'
    process.env.REFRESH_TOKEN_SECRET = STRONG_REFRESH

    expect(() => SecurityConfig()).toThrow(/JWT_SECRET/)
  })

  it('builds config when both secrets are strong', () => {
    process.env.JWT_SECRET = STRONG_JWT
    process.env.REFRESH_TOKEN_SECRET = STRONG_REFRESH

    expect(SecurityConfig()).toEqual(expect.objectContaining({
      jwtSecret: STRONG_JWT,
      refreshSecret: STRONG_REFRESH,
    }))
  })
})

function restoreEnv(key: string, value: string | undefined) {
  if (typeof value === 'undefined')
    delete process.env[key]
  else
    process.env[key] = value
}
