import fs from 'node:fs'
import path from 'node:path'

import { MigrationInterface, QueryRunner } from 'typeorm'

const sql = fs.readFileSync(path.join(__dirname, '../../deploy/sql/nest_admin.sql'), 'utf8')

export class InitData1707996695540 implements MigrationInterface {
  name = 'InitData1707996695540'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(sql)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
