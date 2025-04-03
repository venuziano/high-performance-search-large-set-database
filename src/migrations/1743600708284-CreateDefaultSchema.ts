import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDefaultSchema1743600708284 implements MigrationInterface {
  name = 'CreateDefaultSchema1743600708284';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(), "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "book_categories" ("book_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_76506a56b5e205f79d9cdfc39ef" PRIMARY KEY ("book_id", "category_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "book" ("created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(), "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "author" character varying(255) NOT NULL, "publisher" character varying(255), "publication_date" TIMESTAMP, "page_count" integer, CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_categories" ADD CONSTRAINT "FK_bf7e0293afeaeacbe28b7f96e43" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_categories" ADD CONSTRAINT "FK_2f8815188674efa2fc146b329e5" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book_categories" DROP CONSTRAINT "FK_2f8815188674efa2fc146b329e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book_categories" DROP CONSTRAINT "FK_bf7e0293afeaeacbe28b7f96e43"`,
    );
    await queryRunner.query(`DROP TABLE "book"`);
    await queryRunner.query(`DROP TABLE "book_categories"`);
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
