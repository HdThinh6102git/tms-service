import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700622657449 implements MigrationInterface {
  name = 'migration1700622657449';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "class_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_241fcc163fef37b7105a3038615" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_241fcc163fef37b7105a3038615"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "class_id"`);
  }
}
