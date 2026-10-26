import cluster from 'node:cluster'

export const isMainCluster
  = process.env.NODE_APP_INSTANCE && Number.parseInt(process.env.NODE_APP_INSTANCE) === 0
export const isMainProcess = cluster.isPrimary || isMainCluster

export const isDev = process.env.NODE_ENV === 'development'

export const isTest = !!process.env.TEST
export const cwd = process.cwd()

/**
 * 基础类型接口
 */
export type BaseType = boolean | number | string | undefined | null

/**
 * 格式化环境变量
 * @param key 环境变量的键值
 * @param defaultValue 默认值
 * @param callback 格式化函数
 */
function formatValue<T extends BaseType = string>(key: string, defaultValue: T, callback?: (value: string) => T): T {
  const value: string | undefined = process.env[key]
  if (typeof value === 'undefined')
    return defaultValue

  if (!callback)
    return value as unknown as T

  return callback(value)
}

export function env(key: string, defaultValue: string = '') {
  return formatValue(key, defaultValue)
}

export function envString(key: string, defaultValue: string = '') {
  return formatValue(key, defaultValue)
}

export function envNumber(key: string, defaultValue: number = 0) {
  return formatValue(key, defaultValue, (value) => {
    try {
      return Number(value)
    }
    catch {
      throw new Error(`${key} environment variable is not a number`)
    }
  })
}

const ENV_BOOLEAN_TRUE = new Set(['true', '1'])
const ENV_BOOLEAN_FALSE = new Set(['false', '0'])

/**
 * 去掉环境变量值外围的空白，以及部署工具可能保留下来的一层或两层引号。
 * `docker run --env-file` 会把 `IS_DEMO="false"` 原样传成 `"false"`（含引号字符）。
 */
function unwrapEnvValue(raw: string): string {
  let value = raw.trim()

  for (let i = 0; i < 2; i++) {
    const quote = value[0]
    const wrapped = (quote === '"' || quote === '\'')
      && value.length >= 2
      && value.endsWith(quote)
    if (!wrapped)
      break

    value = value.slice(1, -1).trim()
  }

  return value
}

/**
 * 解析布尔环境变量。
 * 关闭：false / 0 / "false" / "0"（大小写不敏感，允许首尾空白和最多两层引号）。
 * 开启：true / 1 / "true" / "1"，以及其它非 0 数字。
 * 不能用 Boolean(JSON.parse())：JSON.parse('"false"') 得到字符串 "false"，
 * Boolean("false") === true，会把本应关闭的开关打开。
 */
function parseEnvBoolean(raw: string): boolean | undefined {
  const value = unwrapEnvValue(raw)
  const normalized = value.toLowerCase()

  if (ENV_BOOLEAN_TRUE.has(normalized))
    return true
  if (ENV_BOOLEAN_FALSE.has(normalized))
    return false

  try {
    const parsed = JSON.parse(value)
    if (typeof parsed === 'boolean')
      return parsed
    if (typeof parsed === 'number')
      return parsed !== 0 && !Number.isNaN(parsed)
    if (parsed === null)
      return false
    if (typeof parsed === 'string') {
      const inner = unwrapEnvValue(parsed).toLowerCase()
      if (ENV_BOOLEAN_TRUE.has(inner))
        return true
      if (ENV_BOOLEAN_FALSE.has(inner))
        return false
    }
  }
  catch {
    // 留给调用方抛出统一错误
  }

  return undefined
}

export function envBoolean(key: string, defaultValue: boolean = false) {
  return formatValue(key, defaultValue, (value) => {
    const parsed = parseEnvBoolean(value)
    if (parsed === undefined)
      throw new Error(`${key} environment variable is not a boolean`)

    return parsed
  })
}
