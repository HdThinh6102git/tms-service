import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700731759049 implements MigrationInterface {
  name = 'migration1700731759049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topic_registration" ALTER COLUMN "message" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topic_registration" ALTER COLUMN "message" SET NOT NULL`,
    );
  }
}
