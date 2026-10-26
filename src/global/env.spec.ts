import { envBoolean } from './env'

describe('envBoolean', () => {
  const keys = ['IS_DEMO', 'DB_SYNCHRONIZE', 'SWAGGER_ENABLE', 'MULTI_DEVICE_LOGIN']
  const previous = new Map<string, string | undefined>()

  beforeEach(() => {
    for (const key of keys) {
      previous.set(key, process.env[key])
      delete process.env[key]
    }
  })

  afterEach(() => {
    for (const key of keys) {
      const value = previous.get(key)
      if (typeof value === 'undefined')
        delete process.env[key]
      else
        process.env[key] = value
    }
  })

  it('uses the default when the variable is unset', () => {
    expect(envBoolean('IS_DEMO')).toBe(false)
    expect(envBoolean('IS_DEMO', true)).toBe(true)
  })

  it.each([
    'false',
    'FALSE',
    'False',
    '0',
    '  false  ',
    '  0  ',
    '"false"',
    '"FALSE"',
    '"0"',
    '\'false\'',
    '\'0\'',
    '  "false"  ',
    '  \'false\'  ',
    '" false "',
    '\'"false"\'',
    '"\'false\'"',
  ])('treats %p as false', (value) => {
    process.env.IS_DEMO = value
    expect(envBoolean('IS_DEMO')).toBe(false)
  })

  it.each([
    'true',
    'TRUE',
    'True',
    '1',
    '  true  ',
    '"true"',
    '"1"',
    '\'true\'',
    '  "true"  ',
  ])('treats %p as true', (value) => {
    process.env.IS_DEMO = value
    expect(envBoolean('IS_DEMO')).toBe(true)
  })

  it('keeps other boolean flags working', () => {
    process.env.DB_SYNCHRONIZE = 'false'
    process.env.SWAGGER_ENABLE = 'true'
    process.env.MULTI_DEVICE_LOGIN = '"true"'

    expect(envBoolean('DB_SYNCHRONIZE', true)).toBe(false)
    expect(envBoolean('SWAGGER_ENABLE')).toBe(true)
    expect(envBoolean('MULTI_DEVICE_LOGIN', false)).toBe(true)
  })

  it('still accepts non-zero numbers and null the way JSON booleans did', () => {
    process.env.IS_DEMO = '2'
    expect(envBoolean('IS_DEMO')).toBe(true)

    process.env.IS_DEMO = '0.0'
    expect(envBoolean('IS_DEMO')).toBe(false)

    process.env.IS_DEMO = 'null'
    expect(envBoolean('IS_DEMO')).toBe(false)
  })

  it.each(['', '   ', 'yes', 'no', 'off', 'on', 'Falsey', '"maybe"'])('rejects %p', (value) => {
    process.env.IS_DEMO = value
    expect(() => envBoolean('IS_DEMO')).toThrow('IS_DEMO environment variable is not a boolean')
  })
})
