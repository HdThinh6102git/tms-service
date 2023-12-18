import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1702806451258 implements MigrationInterface {
  name = 'migration1702806451258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" SERIAL NOT NULL, "permission_name" character varying(255) NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', "updated_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "role" ADD "permission_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_96c8f1fd25538d3692024115b47" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "FK_96c8f1fd25538d3692024115b47"`,
    );
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "permission_id"`);
    await queryRunner.query(`DROP TABLE "permission"`);
  }
}
