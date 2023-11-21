import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700534686277 implements MigrationInterface {
  name = 'migration1700534686277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "major" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "admin_id" uuid, CONSTRAINT "PK_00341ff87e17ae50751c5da05ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "major" ADD CONSTRAINT "FK_d69134ccd6e841d39037243d164" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "major" DROP CONSTRAINT "FK_d69134ccd6e841d39037243d164"`,
    );
    await queryRunner.query(`DROP TABLE "major"`);
  }
}
