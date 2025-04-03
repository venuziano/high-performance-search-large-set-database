import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndexes1743622020449 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the pg_trgm extension if it doesn't exist
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

    // Create full text search indexes
    await queryRunner.query(`
      CREATE INDEX book_fts_idx ON book 
      USING gin(
        to_tsvector(
          'english', 
          coalesce(name, '') || ' ' || coalesce(author, '') || ' ' || coalesce(publisher, '')
        )
      );
    `);

    await queryRunner.query(`
      CREATE INDEX category_fts_idx ON category 
      USING gin(
        to_tsvector('english', name)
      );
    `);

    // Create indexes for regular sort requests
    await queryRunner.query(`CREATE INDEX idx_book_name ON book (name);`);
    await queryRunner.query(`CREATE INDEX idx_book_author ON book (author);`);
    await queryRunner.query(
      `CREATE INDEX idx_book_publisher ON book (publisher);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_book_created_at ON book (created_at);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_book_updated_at ON book (updated_at);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the sort indexes
    await queryRunner.query(`DROP INDEX IF EXISTS idx_book_updated_at;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_book_created_at;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_book_publisher;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_book_author;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_book_name;`);

    // Drop the full text search indexes
    await queryRunner.query(`DROP INDEX IF EXISTS category_fts_idx;`);
    await queryRunner.query(`DROP INDEX IF EXISTS book_fts_idx;`);

    // Optionally, drop the extension (uncomment if you want to remove it)
    await queryRunner.query(`DROP EXTENSION IF EXISTS pg_trgm;`);
  }
}
