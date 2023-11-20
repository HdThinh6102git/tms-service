import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700278081343 implements MigrationInterface {
  name = 'migration1700278081343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topic_registration_phase" ADD "admin_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_registration_phase" ADD CONSTRAINT "FK_678d51b185425cb129882102407" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topic_registration_phase" DROP CONSTRAINT "FK_678d51b185425cb129882102407"`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_registration_phase" DROP COLUMN "admin_id"`,
    );
  }
}
