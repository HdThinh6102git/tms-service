import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700277526219 implements MigrationInterface {
  name = 'migration1700277526219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "topic_registration_phase" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "finish_date" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_41911d1f9d0a9504069c58156ab" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "topic_registration_phase"`);
  }
}
