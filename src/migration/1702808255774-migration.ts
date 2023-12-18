import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1702808255774 implements MigrationInterface {
  name = 'migration1702808255774';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "is_major_head" boolean`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_major_head"`);
  }
}
