import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1701070480324 implements MigrationInterface {
  name = 'migration1701070480324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assignment" ALTER COLUMN "score" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ALTER COLUMN "result_file" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ALTER COLUMN "result_text" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assignment" ALTER COLUMN "result_text" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ALTER COLUMN "result_file" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ALTER COLUMN "score" SET NOT NULL`,
    );
  }
}
