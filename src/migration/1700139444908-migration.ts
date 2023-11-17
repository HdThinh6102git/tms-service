import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700139444908 implements MigrationInterface {
  name = 'migration1700139444908';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "start_year" numeric`);
    await queryRunner.query(`ALTER TABLE "user" ADD "finish_year" numeric`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "finish_year"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "start_year"`);
  }
}
