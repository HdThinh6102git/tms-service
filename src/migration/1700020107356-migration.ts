import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700020107356 implements MigrationInterface {
  name = 'migration1700020107356';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "announcement" ADD "status" numeric NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "status"`);
  }
}
