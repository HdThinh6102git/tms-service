import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700023864130 implements MigrationInterface {
  name = 'migration1700023864130';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "role" ADD "status" numeric NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" ALTER COLUMN "updated_at" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "role" ADD "status" character varying NOT NULL DEFAULT 'ACTIVE'`,
    );
  }
}
