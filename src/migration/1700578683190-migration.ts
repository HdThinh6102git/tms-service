import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700578683190 implements MigrationInterface {
  name = 'migration1700578683190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "class" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "start_year" numeric, "finish_year" numeric, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "admin_id" uuid, "major_id" uuid, CONSTRAINT "PK_0b9024d21bdfba8b1bd1c300eae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" ADD CONSTRAINT "FK_c1ec8355a0724ebdaed4198c0c7" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" ADD CONSTRAINT "FK_b25d55ee76ce576225c7c65cc08" FOREIGN KEY ("major_id") REFERENCES "major"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "class" DROP CONSTRAINT "FK_b25d55ee76ce576225c7c65cc08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class" DROP CONSTRAINT "FK_c1ec8355a0724ebdaed4198c0c7"`,
    );
    await queryRunner.query(`DROP TABLE "class"`);
  }
}
