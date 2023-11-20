import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700452866368 implements MigrationInterface {
  name = 'migration1700452866368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topic_registration_phase" DROP COLUMN "start_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_registration_phase" ADD "start_date" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_registration_phase" DROP COLUMN "finish_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_registration_phase" ADD "finish_date" text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topic_registration_phase" DROP COLUMN "finish_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_registration_phase" ADD "finish_date" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_registration_phase" DROP COLUMN "start_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_registration_phase" ADD "start_date" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
  }
}
