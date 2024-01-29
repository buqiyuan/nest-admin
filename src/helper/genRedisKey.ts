import { RedisKeys } from '~/constants/cache.constant'

/** 生成验证码 redis key */
export function genCaptchaImgKey(val: string | number) {
  return `${RedisKeys.CAPTCHA_IMG_PREFIX}${String(val)}` as const
}

/** 生成 auth token redis key */
export function genAuthTokenKey(val: string | number) {
  return `${RedisKeys.AUTH_TOKEN_PREFIX}${String(val)}` as const
}
/** 生成 auth permission redis key */
export function genAuthPermKey(val: string | number) {
  return `${RedisKeys.AUTH_PERM_PREFIX}${String(val)}` as const
}
/** 生成 auth passwordVersion redis key */
export function genAuthPVKey(val: string | number) {
  return `${RedisKeys.AUTH_PASSWORD_V_PREFIX}${String(val)}` as const
}
