import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1700729556184 implements MigrationInterface {
  name = 'migration1700729556184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "topic_registration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" text NOT NULL, "status" numeric NOT NULL DEFAULT '1', "type" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "topic_id" uuid, "user_id" uuid, CONSTRAINT "PK_03bb878fa52f1def44bd1bec738" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "student_project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_id" character varying NOT NULL, "role" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "topic_id" uuid, "topic_registration_id" uuid, CONSTRAINT "PK_d6ebbf5a7ff4cbc30e521c9a77e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "assignment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "start_at" text NOT NULL, "finish_at" text NOT NULL, "status" numeric NOT NULL, "score" numeric NOT NULL, "result_file" character varying NOT NULL, "result_text" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "student_project_id" uuid, "topic_id" uuid, CONSTRAINT "PK_43c2f5a3859f54cedafb270f37e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_registration" ADD CONSTRAINT "FK_540f4dc0a6b354b0c687e527b91" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_registration" ADD CONSTRAINT "FK_3cf5e6af021c7bc4a87c0aada43" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_project" ADD CONSTRAINT "FK_ff22c694ca5f8959c6e205d5ac0" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_project" ADD CONSTRAINT "FK_d0573e9f53be8aeaaaab19bddd7" FOREIGN KEY ("topic_registration_id") REFERENCES "topic_registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_5bbdb0b6231dc9d15303bbe14c9" FOREIGN KEY ("student_project_id") REFERENCES "student_project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" ADD CONSTRAINT "FK_b66b9995579843f5b39bc5cd342" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_b66b9995579843f5b39bc5cd342"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assignment" DROP CONSTRAINT "FK_5bbdb0b6231dc9d15303bbe14c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_project" DROP CONSTRAINT "FK_d0573e9f53be8aeaaaab19bddd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_project" DROP CONSTRAINT "FK_ff22c694ca5f8959c6e205d5ac0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_registration" DROP CONSTRAINT "FK_3cf5e6af021c7bc4a87c0aada43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "topic_registration" DROP CONSTRAINT "FK_540f4dc0a6b354b0c687e527b91"`,
    );
    await queryRunner.query(`DROP TABLE "assignment"`);
    await queryRunner.query(`DROP TABLE "student_project"`);
    await queryRunner.query(`DROP TABLE "topic_registration"`);
  }
}
