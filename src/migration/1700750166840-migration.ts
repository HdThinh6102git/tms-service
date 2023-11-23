import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700750166840 implements MigrationInterface {
  name = 'migration1700750166840';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_project" ADD "status" numeric NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_project" DROP COLUMN "status"`,
    );
  }
}
