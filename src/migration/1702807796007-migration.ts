import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1702807796007 implements MigrationInterface {
  name = 'migration1702807796007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "FK_96c8f1fd25538d3692024115b47"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "permission_id"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" ADD "permission_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_96c8f1fd25538d3692024115b47" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
