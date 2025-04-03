import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePopulateCategoryProcedure1743601103017
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE OR REPLACE PROCEDURE public.populate_category()
            LANGUAGE plpgsql
            AS $procedure$
            DECLARE
              i INTEGER := 1;
              random_index INTEGER;
              categories TEXT[] := ARRAY[
                'Romance',
                'Mystery & Thriller',
                'Science Fiction',
                'Fantasy',
                'Historical Fiction',
                'Biography & Memoir',
                'Self-Help',
                'Young Adult',
                'Horror',
                'Non-Fiction'
              ];
            BEGIN
              WHILE i <= 100 LOOP
                random_index := floor(random() * array_length(categories, 1)) + 1;
                INSERT INTO category(name) VALUES (categories[random_index] || '-' || i);
                i := i + 1;
              END LOOP;
            END;
            $procedure$
        `);

    // Call the procedure to execute it
    await queryRunner.query(`CALL public.populate_category();`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP PROCEDURE IF EXISTS public.populate_category();
        `);
  }
}
