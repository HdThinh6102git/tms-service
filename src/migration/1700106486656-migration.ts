import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700106486656 implements MigrationInterface {
  name = 'migration1700106486656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refresh_token"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "refresh_token" character varying`,
    );
  }
}
