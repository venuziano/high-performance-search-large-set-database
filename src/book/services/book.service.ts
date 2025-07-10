import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Brackets } from 'typeorm';
import { Book } from 'src/entity/book.entity';
import { getAllBooksDTO } from 'src/dto/book/get.all.book.dto';
import { GetAllBooksPaginatedResponse } from 'src/types/pagination.types';
import { tsquery } from 'src/utils/filter.util';
import { BookCategory } from 'src/entity/book.categories.entity';
import { Category } from 'src/entity/category.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) { }

  /**
   * Retrieve all books with their categories, applying an optional filter and pagination.
   *
   * @param limit Maximum number of records per page.
   * @param page Current page number.
   * @param filter Optional filter string to search by book name.
   * @param sort Optional sort field.
   * @param order Optional sort order (ASC or DESC).
   * @returns A paginated response containing the mapped book DTOs.
   */
  async getAllBooks(
    limit: number,
    page: number,
    filter?: string,
    sort?: string,
    order?: string,
  ): Promise<GetAllBooksPaginatedResponse> {
    const allowedSortFields: string[] = [
      'name',
      'author',
      'publisher',
      'publication_date',
      'page_count',
      'created_at',
      'updated_at',
    ];

    // Prevent SQL injection
    if (sort && !allowedSortFields.includes(sort)) {
      throw new Error('Invalid sort field');
    }

    const allowedSortOrders: string[] = ['ASC', 'DESC'];
    if (order && !allowedSortOrders.includes(order.toUpperCase())) {
      throw new Error('Invalid sort order');
    }

    const sortField: string =
      sort && allowedSortFields.includes(sort) ? sort : 'updated_at';

    const sortOrder: 'ASC' | 'DESC' =
      order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const offset: number = (page - 1) * limit;

    const rawQueryUsingFilter: string = `
    SELECT
      *,
      (
        SELECT jsonb_agg(jsonb_build_object('category', to_jsonb(c.*)))
        FROM book_categories bc
        JOIN category c ON c.id = bc.category_id
        WHERE bc.book_id = b.id
      ) AS "bookCategories"
    FROM (
      SELECT
        *
      FROM book b
      WHERE to_tsvector('english', coalesce(b.name, '') || ' ' || coalesce(b.author, '') || ' ' || coalesce(b.publisher, ''))
            @@ to_tsquery('english', $1)
      UNION
      SELECT
        *                
      FROM book b
      WHERE EXISTS (
        SELECT 1
        FROM book_categories bc
        JOIN category c ON c.id = bc.category_id
        WHERE bc.book_id = b.id
          AND to_tsvector('english', c.name) @@ to_tsquery('english', $1)
      )
    ) b
    ORDER BY b.${sortField} ${sortOrder}
    LIMIT $2 OFFSET $3;
  `;

    const rawQueryWithoutFilter: string = `
      SELECT
      b.*,
      (
        SELECT jsonb_agg(jsonb_build_object('category', to_jsonb(c.*)))
        FROM book_categories bc
        JOIN category c ON c.id = bc.category_id
        WHERE bc.book_id = b.id
      ) AS "bookCategories"
    FROM book b
    ORDER BY b.${sortField} ${sortOrder}
    LIMIT $1 OFFSET $2`;

    const resultBooks: Book[] = await this.bookRepository.query(
      filter !== '' ? rawQueryUsingFilter : rawQueryWithoutFilter,
      filter !== '' ? [tsquery(filter), limit, offset] : [limit, offset],
    );

    const rawCountQueryUsingFilter: string = `
      SELECT COUNT(*) AS count
      FROM (
        SELECT id
        FROM book
        WHERE to_tsvector('english', coalesce(name, '') || ' ' || coalesce(author, '') || ' ' || coalesce(publisher, ''))
          @@ to_tsquery('english', $1)

        UNION

        SELECT b.id
        FROM book b
        JOIN book_categories bc ON bc.book_id = b.id
        JOIN category c ON c.id = bc.category_id
        WHERE to_tsvector('english', c.name) @@ to_tsquery('english', $1)
      ) AS matching_books;
    `;

    const rawCountQueryWithoutFilter: string = `
      SELECT COUNT(*) AS count
      FROM (
        SELECT b.id
        FROM book b
      ) AS matching_books;`;

    const resultRawCountQuery = await this.bookRepository.query(
      filter !== '' ? rawCountQueryUsingFilter : rawCountQueryWithoutFilter,
      filter !== '' ? [tsquery(filter)] : [],
    );

    const total: number = parseInt(resultRawCountQuery[0].count, 10);

    const data: getAllBooksDTO[] = resultBooks.map(
      (book: Book) => new getAllBooksDTO(book),
    );

    const totalPages: number = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  async getAllSlowBooks(
    limit: number,
    page: number,
    filter?: string,
    sort?: string,
    order?: string,
  ): Promise<GetAllBooksPaginatedResponse> {
    const allowedSortFields = [
      'name',
      'author',
      'publisher',
      'publication_date',
      'page_count',
      'created_at',
      'updated_at',
    ] as const;

    if (sort && !allowedSortFields.includes(sort as any)) {
      throw new Error('Invalid sort field');
    }

    const sortField = sort && allowedSortFields.includes(sort as any)
      ? sort
      : 'updated_at';
    const sortOrder = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const offset = (page - 1) * 10;

    const qb = this.bookRepository
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.bookCategories', 'bc')
      .leftJoinAndSelect('bc.category', 'category');

    if (filter) {
      const tsq = tsquery(filter);
      qb.andWhere(
        new Brackets(qb2 => {
          qb2.where(
            `to_tsvector('english', coalesce(b.name, '') || ' ' || coalesce(b.author, '') || ' ' || coalesce(b.publisher, '')) @@ to_tsquery('english', :tsq)`,
            { tsq },
          )
            .orWhere(
              `to_tsvector('english', category.name) @@ to_tsquery('english', :tsq)`,
              { tsq },
            );
        }),
      );
    }

    qb.orderBy(`b.${sortField}`, sortOrder)
      .skip(offset)
      .take(10);

    const [books, total] = await qb.getManyAndCount();

    const data = books.map(book => new getAllBooksDTO(book));
    const totalPages = Math.ceil(total / 10);

    return {
      data,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  // NOTE: Another example with a different approach, but still very slow.
  //   async getAllSlowBooks1(
  //   limit: number,
  //   page: number,
  //   filter?: string,
  //   sort?: string,
  //   order?: string,
  // ): Promise<GetAllBooksPaginatedResponse> {
  //   const allowedSortFields = [
  //     'name',
  //     'author',
  //     'publisher',
  //     'publication_date',
  //     'page_count',
  //     'created_at',
  //     'updated_at',
  //   ] as const;

  //   if (sort && !allowedSortFields.includes(sort as any)) {
  //     throw new Error('Invalid sort field');
  //   }
  //   const sortField = sort ?? 'updated_at';
  //   const sortOrder = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  //   const offset = (page - 1) * limit;

  //   const qbIds = this.bookRepository
  //     .createQueryBuilder('book')
  //     .select('book.id', 'id');

  //   if (filter?.trim()) {
  //     const query = tsquery(filter);

  //     qbIds.where(
  //       `to_tsvector('english',
  //          coalesce(book.name, '') || ' ' ||
  //          coalesce(book.author, '') || ' ' ||
  //          coalesce(book.publisher, '')
  //        ) @@ to_tsquery('english', :query)`,
  //       { query },
  //     );

  //     qbIds.orWhere(qb =>
  //       `EXISTS(${qb
  //         .subQuery()
  //         .select('1')
  //         .from(BookCategory, 'bc')
  //         .innerJoin(Category, 'c', 'c.id = bc.category_id')
  //         .where('bc.book_id = book.id')
  //         .andWhere(
  //           `to_tsvector('english', c.name) @@ to_tsquery('english', :query)`,
  //         )
  //         .getQuery()})`,
  //       { query },
  //     );
  //   }

  //   qbIds
  //     .orderBy(`book.${sortField}`, sortOrder)
  //     .offset(offset)
  //     .limit(limit);

  //   const rawIds = await qbIds.getRawMany();
  //   const ids = rawIds.map(r => r.id as number);

  //   const books = await this.bookRepository.find({
  //     where: { id: In(ids) },
  //     relations: ['bookCategories', 'bookCategories.category'],
  //     order: { [sortField]: sortOrder as 'ASC' | 'DESC' },
  //   });

  //   const qbCount = this.bookRepository
  //     .createQueryBuilder('book')
  //     .select('COUNT(DISTINCT book.id)', 'count');

  //   if (filter?.trim()) {
  //     const query = tsquery(filter);

  //     qbCount.where(
  //       `to_tsvector('english',
  //          coalesce(book.name, '') || ' ' ||
  //          coalesce(book.author, '') || ' ' ||
  //          coalesce(book.publisher, '')
  //        ) @@ to_tsquery('english', :query)`,
  //       { query },
  //     );

  //     qbCount.orWhere(qb =>
  //       `EXISTS(${qb
  //         .subQuery()
  //         .select('1')
  //         .from(BookCategory, 'bc')
  //         .innerJoin(Category, 'c', 'c.id = bc.category_id')
  //         .where('bc.book_id = book.id')
  //         .andWhere(
  //           `to_tsvector('english', c.name) @@ to_tsquery('english', :query)`,
  //         )
  //         .getQuery()})`,
  //       { query },
  //     );
  //   }

  //   const { count } = await qbCount.getRawOne<{ count: string }>();
  //   const total = parseInt(count, 10);

  //   // Map to DTO and return
  //   const data = books.map(b => new getAllBooksDTO(b));
  //   const totalPages = Math.ceil(total / limit);

  //   return {
  //     data,
  //     total,
  //     page,
  //     totalPages,
  //     hasNextPage: page < totalPages,
  //     hasPreviousPage: page > 1,
  //   };
  // }

  // NOTE: Another example with a different approach, but still very slow.
  // async getAllSlowBooks2(
  //   limit: number,
  //   page: number,
  //   filter?: string,
  //   sort?: string,
  //   order?: string,
  // ): Promise<GetAllBooksPaginatedResponse> {
  //   const allowedSortFields = [
  //     'name',
  //     'author',
  //     'publisher',
  //     'publication_date',
  //     'page_count',
  //     'created_at',
  //     'updated_at',
  //   ] as const;

  //   if (sort && !allowedSortFields.includes(sort as any)) {
  //     throw new Error('Invalid sort field');
  //   }

  //   const allowedSortOrders = ['ASC', 'DESC'] as const;
  //   const sortField = sort && allowedSortFields.includes(sort as any) ? sort : 'updated_at';
  //   const sortOrder = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  //   const offset = (page - 1) * limit;

  //   // Build the main query
  //   const qb = this.bookRepository
  //     .createQueryBuilder('book')
  //     .leftJoinAndSelect('book.bookCategories', 'bc')
  //     .leftJoinAndSelect('bc.category', 'category');

  //   if (filter?.trim()) {
  //     const query = tsquery(filter); // your helper to sanitize/format the tsquery
  //     qb.andWhere(
  //       `(
  //        to_tsvector('english',
  //          coalesce(book.name, '') || ' ' ||
  //          coalesce(book.author, '') || ' ' ||
  //          coalesce(book.publisher, '')
  //        ) @@ to_tsquery('english', :query)
  //      )`,
  //       { query },
  //     )
  //       .orWhere(
  //         `to_tsvector('english', category.name) @@ to_tsquery('english', :query)`,
  //         { query },
  //       );
  //   }

  //   qb
  //     .orderBy(`book.${sortField}`, sortOrder)
  //     .skip(offset)
  //     .take(limit);

  //   // getManyAndCount will issue two queries under the hood:
  //   // one for data (with LIMIT/OFFSET) and one for COUNT(*)
  //   const [resultBooks, total] = await qb.getManyAndCount();

  //   const data = resultBooks.map((book) => new getAllBooksDTO(book));
  //   const totalPages = Math.ceil(total / limit);

  //   return {
  //     data,
  //     total,
  //     page,
  //     totalPages,
  //     hasNextPage: page < totalPages,
  //     hasPreviousPage: page > 1,
  //   };
  // }
}
