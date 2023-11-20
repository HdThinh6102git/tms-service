import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700472597117 implements MigrationInterface {
  name = 'migration1700472597117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "topic" ADD "admin_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "FK_fd0999c23886b9c7e6affa5fa6f" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topic" DROP CONSTRAINT "FK_fd0999c23886b9c7e6affa5fa6f"`,
    );
    await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "admin_id"`);
  }
}
