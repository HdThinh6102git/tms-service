import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700103632145 implements MigrationInterface {
  name = 'migration1700103632145';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin" ADD "email" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "email"`);
  }
}
