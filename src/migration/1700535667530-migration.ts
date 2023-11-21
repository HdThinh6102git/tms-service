import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700535667530 implements MigrationInterface {
  name = 'migration1700535667530';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "topic" ADD "major_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "topic" ADD CONSTRAINT "FK_526fd722fb062da9b7707177002" FOREIGN KEY ("major_id") REFERENCES "major"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "topic" DROP CONSTRAINT "FK_526fd722fb062da9b7707177002"`,
    );
    await queryRunner.query(`ALTER TABLE "topic" DROP COLUMN "major_id"`);
  }
}
