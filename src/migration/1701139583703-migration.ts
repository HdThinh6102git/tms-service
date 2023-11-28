import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1701139583703 implements MigrationInterface {
  name = 'migration1701139583703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "phone_number" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "phone_number" SET NOT NULL`,
    );
  }
}
