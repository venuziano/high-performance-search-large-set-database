import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePopulateBookProcedure1743621394016
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE OR REPLACE PROCEDURE public.populate_book()
LANGUAGE plpgsql
AS $procedure$
DECLARE
  i INTEGER := 1;
  random_name_index INTEGER;
  random_author_index INTEGER;
  random_publisher_index INTEGER;
  days_range INTEGER;
  seconds_range NUMERIC;
  publication_date DATE;
  created_at TIMESTAMP;
  updated_at TIMESTAMP;
  names TEXT[] := ARRAY[
    'The Whispering Fog',
    'Echoes of a Shattered Sky',
    'Beneath the Crimson Leaves',
    'The Algorithm of Souls',
    'Lanterns in the Abyss',
    'Chronicles of the Forgotten Gate',
    'Paper Moons and Glass Hearts',
    'The Clockmaker’s Paradox',
    'Harvest of the Hollow Moon',
    'Voices Beyond the Veil'
  ];
  authors TEXT[] := ARRAY[
    'Jane Austen',
    'George Orwell',
    'J.K. Rowling',
    'Stephen King',
    'Agatha Christie',
    'Mark Twain',
    'Ernest Hemingway',
    'F. Scott Fitzgerald',
    'J.R.R. Tolkien',
    'Virginia Woolf'
  ];
  publishers TEXT[] := ARRAY[
    'Penguin Random House',
    'HarperCollins',
    'Simon & Schuster',
    'Hachette Book Group',
    'Macmillan Publishers',
    'Scholastic Corporation',
    'Bloomsbury Publishing',
    'Oxford University Press',
    'Cambridge University Press',
    'Wiley'
  ];
BEGIN
  -- Calculate the number of days between 1900-01-01 and 2025-12-31
  days_range := date '2025-12-31' - date '1900-01-01';
  
  -- Calculate the number of seconds between 1900-01-01 and 2025-12-31 (with full-day coverage)
  seconds_range := extract(epoch from (timestamp '2025-12-31 23:59:59' - timestamp '1900-01-01 00:00:00'));
  
  WHILE i <= 2000000 LOOP
    random_name_index := floor(random() * array_length(names, 1)) + 1;
    random_author_index := floor(random() * array_length(authors, 1)) + 1;
    random_publisher_index := floor(random() * array_length(publishers, 1)) + 1;
    
    -- Generate a random publication date within the specified range
    publication_date := date '1900-01-01' + floor(random() * (days_range + 1))::int;
    
    -- Generate a random created_at timestamp between 1900-01-01 and 2025-12-31
    created_at := timestamp '1900-01-01' + floor(random() * seconds_range) * interval '1 second';
    
    -- Generate updated_at as a random timestamp between created_at and 2025-12-31 23:59:59
    updated_at := created_at + floor(random() * extract(epoch from (timestamp '2025-12-31 23:59:59' - created_at)) ) * interval '1 second';
    
    INSERT INTO book(name, author, publisher, publication_date, page_count, created_at, updated_at)
    VALUES (
      names[random_name_index] || '-' || i,
      authors[random_author_index],
      publishers[random_publisher_index],
      publication_date,
      (floor(random() * 901) + 100)::int,
      created_at,
      updated_at
    );
    
        i := i + 1;
        END LOOP;
        END;
        $procedure$
    ;`);

    // Call the procedure to execute it
    await queryRunner.query(`CALL public.populate_book();`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP PROCEDURE IF EXISTS public.populate_book();
    `);
  }
}
