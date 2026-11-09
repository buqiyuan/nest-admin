import { ConfigType, registerAs } from '@nestjs/config'

import dotenv from 'dotenv'

import { DataSource, DataSourceOptions } from 'typeorm'

import { env, envBoolean, envNumber } from '~/global/env'

// CLI 不经过 ConfigModule，先把当前环境文件读进来，警告才能看到 DB_SYNCHRONIZE。
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

if (envBoolean('DB_SYNCHRONIZE', false)) {
  console.warn(
    '[database] DB_SYNCHRONIZE is ignored. TypeORM 1 will not run schema sync; apply migrations instead.',
  )
}

// 当前通过 npm scripts 执行的命令
const currentScript = process.env.npm_lifecycle_event

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: env('DB_HOST', '127.0.0.1'),
  port: envNumber('DB_PORT', 3306),
  username: env('DB_USERNAME'),
  password: env('DB_PASSWORD'),
  database: env('DB_DATABASE'),
  // TypeORM 1 调整了默认命名哈希，并会把 nullable:false 的多对一改成 INNER JOIN。
  // synchronize 会按新元数据改索引和外键，可能重命名约束。这里强制关闭，结构只走迁移。
  synchronize: false,
  // 解决通过 pnpm migration:run 初始化数据时，遇到的 SET FOREIGN_KEY_CHECKS = 0; 等语句报错问题, 仅在执行数据迁移操作时设为 true
  multipleStatements: currentScript === 'typeorm',
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  subscribers: ['dist/modules/**/*.subscriber{.ts,.js}'],
}
export const dbRegToken = 'database'

export const DatabaseConfig = registerAs(
  dbRegToken,
  (): DataSourceOptions => dataSourceOptions,
)

export type IDatabaseConfig = ConfigType<typeof DatabaseConfig>

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
