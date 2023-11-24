import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700822938824 implements MigrationInterface {
  name = 'migration1700822938824';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topic" ADD "status" numeric NOT NULL DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "status"`);
  }
}
