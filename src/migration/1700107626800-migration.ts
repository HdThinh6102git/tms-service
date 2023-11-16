import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700107626800 implements MigrationInterface {
  name = 'migration1700107626800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birth_date"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "birth_date" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birth_date"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "birth_date" TIMESTAMP`);
  }
}
