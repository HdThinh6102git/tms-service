import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1701069760528 implements MigrationInterface {
  name = 'migration1701069760528';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_5bbdb0b6231dc9d15303bbe14c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP COLUMN "student_project_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD "student_project_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_5bbdb0b6231dc9d15303bbe14c9" FOREIGN KEY ("student_project_id") REFERENCES "student_project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
