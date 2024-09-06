import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateTable2001717007831711 implements MigrationInterface {
  name = 'UpdateTable2001717007831711'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sys_dept\` ADD \`create_by\` int NULL COMMENT '创建者'`)
    await queryRunner.query(`ALTER TABLE \`sys_dept\` ADD \`update_by\` int NULL COMMENT '更新者'`)
    await queryRunner.query(`ALTER TABLE \`sys_menu\` ADD \`create_by\` int NULL COMMENT '创建者'`)
    await queryRunner.query(`ALTER TABLE \`sys_menu\` ADD \`update_by\` int NULL COMMENT '更新者'`)
    await queryRunner.query(`ALTER TABLE \`sys_role\` ADD \`create_by\` int NULL COMMENT '创建者'`)
    await queryRunner.query(`ALTER TABLE \`sys_role\` ADD \`update_by\` int NULL COMMENT '更新者'`)
    await queryRunner.query(`ALTER TABLE \`sys_role\` CHANGE \`value\` \`value\` varchar(255) NOT NULL COMMENT '角色标识'`)
    await queryRunner.query(`ALTER TABLE \`sys_dict_type\` CHANGE \`create_by\` \`create_by\` int NULL COMMENT '创建者'`)
    await queryRunner.query(`ALTER TABLE \`sys_dict_type\` CHANGE \`update_by\` \`update_by\` int NULL COMMENT '更新者'`)
    await queryRunner.query(`ALTER TABLE \`sys_dict_item\` CHANGE \`create_by\` \`create_by\` int NULL COMMENT '创建者'`)
    await queryRunner.query(`ALTER TABLE \`sys_dict_item\` CHANGE \`update_by\` \`update_by\` int NULL COMMENT '更新者'`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`sys_dict_item\` CHANGE \`update_by\` \`update_by\` int NOT NULL COMMENT '更新者'`)
    await queryRunner.query(`ALTER TABLE \`sys_dict_item\` CHANGE \`create_by\` \`create_by\` int NOT NULL COMMENT '创建者'`)
    await queryRunner.query(`ALTER TABLE \`sys_dict_type\` CHANGE \`update_by\` \`update_by\` int NOT NULL COMMENT '更新者'`)
    await queryRunner.query(`ALTER TABLE \`sys_dict_type\` CHANGE \`create_by\` \`create_by\` int NOT NULL COMMENT '创建者'`)
    await queryRunner.query(`ALTER TABLE \`sys_role\` CHANGE \`value\` \`value\` varchar(255) NOT NULL`)
    await queryRunner.query(`ALTER TABLE \`sys_role\` DROP COLUMN \`update_by\``)
    await queryRunner.query(`ALTER TABLE \`sys_role\` DROP COLUMN \`create_by\``)
    await queryRunner.query(`ALTER TABLE \`sys_menu\` DROP COLUMN \`update_by\``)
    await queryRunner.query(`ALTER TABLE \`sys_menu\` DROP COLUMN \`create_by\``)
    await queryRunner.query(`ALTER TABLE \`sys_dept\` DROP COLUMN \`update_by\``)
    await queryRunner.query(`ALTER TABLE \`sys_dept\` DROP COLUMN \`create_by\``)
  }
}
