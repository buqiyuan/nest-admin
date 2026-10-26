import { ConfigType, registerAs } from '@nestjs/config'

import { env, envNumber } from '~/global/env'

export const securityRegToken = 'security'

/** HMAC 密钥最短长度。短于该长度直接拒绝启动。 */
export const MIN_JWT_SECRET_LENGTH = 32

/**
 * 曾经随仓库下发，或常见的占位密钥。
 * 比较前会 trim，并忽略大小写。
 */
export const KNOWN_WEAK_SECRETS = [
  // 旧 env 文件里的占位值。未加引号时 dotenv 会把 # 当成注释，实际加载值是 admin!@。
  'admin!@#123',
  'admin!@',
  'secret',
  'changeme',
  'change-me',
  'change_me',
  'password',
  'passw0rd',
  'jwt_secret',
  'jwt-secret',
  'your-secret',
  'your_secret',
  'default',
  '123456',
  '12345678',
  'admin',
  'test',
  'undefined',
  'null',
  'none',
] as const

const weakSecretSet = new Set<string>(KNOWN_WEAK_SECRETS.map(item => item.toLowerCase()))

export function normalizeSecret(raw: string | undefined | null): string {
  let value = (raw ?? '').trim()
  const wrappedByDoubleQuote = value.startsWith('"') && value.endsWith('"')
  const wrappedBySingleQuote = value.startsWith('\'') && value.endsWith('\'')
  if ((wrappedByDoubleQuote || wrappedBySingleQuote) && value.length >= 2)
    value = value.slice(1, -1).trim()

  return value
}

function secretRejectionReason(secret: string): string | undefined {
  if (!secret)
    return 'is missing or empty'

  if (weakSecretSet.has(secret.toLowerCase()))
    return 'is a known default or placeholder'

  if (secret.length < MIN_JWT_SECRET_LENGTH)
    return `is too short (${secret.length} < ${MIN_JWT_SECRET_LENGTH})`

  return undefined
}

/**
 * 缺失、空串、已知默认值或过短的签名密钥一律拒绝，避免带着公开密钥启动。
 * 错误信息不会回显密钥内容。
 */
export function assertStrongSecret(name: string, raw: string | undefined | null): string {
  const secret = normalizeSecret(raw)
  const reason = secretRejectionReason(secret)
  if (reason) {
    throw new Error(
      `[security] Refusing to start: ${name} ${reason}. `
      + `Set ${name} to a unique random value of at least ${MIN_JWT_SECRET_LENGTH} characters `
      + '(for example: openssl rand -base64 48) in an untracked env file before starting.',
    )
  }

  return secret
}

export const SecurityConfig = registerAs(securityRegToken, () => ({
  jwtSecret: assertStrongSecret('JWT_SECRET', env('JWT_SECRET')),
  jwtExprire: envNumber('JWT_EXPIRE'),
  refreshSecret: assertStrongSecret('REFRESH_TOKEN_SECRET', env('REFRESH_TOKEN_SECRET')),
  refreshExpire: envNumber('REFRESH_TOKEN_EXPIRE'),
}))

export type ISecurityConfig = ConfigType<typeof SecurityConfig>
