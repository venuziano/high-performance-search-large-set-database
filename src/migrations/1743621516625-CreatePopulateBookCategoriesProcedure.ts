import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePopulateBookCategoriesProcedure1743621516625
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE OR REPLACE PROCEDURE public.populate_book_categories()
 LANGUAGE plpgsql
AS $procedure$
DECLARE
    v_book_id INT;
    v_special_book_id INT;
    v_special_category_id INT;
    i INT;
    cur_books CURSOR FOR SELECT id FROM book;
BEGIN
    OPEN cur_books;

    LOOP
        FETCH cur_books INTO v_book_id;
        EXIT WHEN NOT FOUND;

        -- For the current book, insert 10 random categories
        INSERT INTO book_categories (book_id, category_id)
            SELECT v_book_id, c.id
            FROM category c
            ORDER BY random()
            LIMIT 10;
    END LOOP;

    CLOSE cur_books;
    
    -- Create the special category record only once
    INSERT INTO category (name)
    VALUES ('special category')
    RETURNING id INTO v_special_category_id;
    
    -- Create 7 special book records
    FOR i IN 1..7 LOOP
        -- Insert the special book record with random values for non-required fields
        INSERT INTO book (name, author, publisher, publication_date, page_count)
        VALUES (
            'special book', 
            'Jane Austen', 
            'Penguin Random House', 
            CURRENT_DATE, 
            (FLOOR(RANDOM() * 400) + 100)::int
        )
        RETURNING id INTO v_special_book_id;
        
        IF i = 1 THEN
            -- For the first special book: bind the special category
            INSERT INTO book_categories (book_id, category_id)
            VALUES (v_special_book_id, v_special_category_id);
            
            -- Plus add 9 additional random categories (excluding the special category)
            INSERT INTO book_categories (book_id, category_id)
                SELECT v_special_book_id, c.id
                FROM category c
                WHERE c.id <> v_special_category_id
                ORDER BY random()
                LIMIT 9;
        ELSE
            -- For the other special books: assign 10 random categories (excluding the special category)
            INSERT INTO book_categories (book_id, category_id)
                SELECT v_special_book_id, c.id
                FROM category c
                WHERE c.id <> v_special_category_id
                ORDER BY random()
                LIMIT 10;
        END IF;
    END LOOP;
END;
$procedure$
;`);

    // Call the procedure to execute it
    await queryRunner.query(`CALL public.populate_book_categories();`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP PROCEDURE IF EXISTS public.populate_book_categories();
        `);
  }
}
