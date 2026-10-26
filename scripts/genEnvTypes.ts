import fs from 'node:fs'
import path from 'node:path'

import dotenv from 'dotenv'

const directoryPath = path.resolve(__dirname, '..')

const targets = ['.env', `.env.${process.env.NODE_ENV || 'development'}`]

function resolveEnvFile(file: string): string | undefined {
  const full = path.join(directoryPath, file)
  if (fs.existsSync(full))
    return full

  const example = `${full}.example`
  if (fs.existsSync(example))
    return example

  return undefined
}

const envObj = targets.reduce((prev, file) => {
  const full = resolveEnvFile(file)
  if (!full)
    return prev

  const result = dotenv.parse(fs.readFileSync(full))
  return { ...prev, ...result }
}, {} as Record<string, string>)

const envType = Object.keys(envObj).reduce((prev, key) => {
  return `${prev}
      ${key}: string;`
}, '').trim()

fs.writeFile(path.join(directoryPath, 'types/env.d.ts'), `
// generate by ./scripts/generateEnvTypes.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ${envType}
    }
  }
}
export {};
  `, (err) => {
  if (err)
    console.log('生成 env.d.ts 文件失败')
  else
    console.log('成功生成 env.d.ts 文件')
})

//   console.log('envObj:', envObj)

function formatValue(value) {
  let _value
  try {
    const res = JSON.parse(value)
    _value = typeof res === 'object' ? value : res
  }
  catch (error) {
    _value = `'${value}'`
  }
  return _value
}
