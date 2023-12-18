import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1702886243727 implements MigrationInterface {
  name = 'migration1702886243727';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_major_head"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "is_major_head" boolean`);
  }
}
