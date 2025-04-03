import { ApiProperty } from '@nestjs/swagger';
import { Book } from 'src/entity/book.entity';
import { GetBookCategoryDTO } from '../book-categories/book.categories.dto';

export class getAllBooksDTO {
  @ApiProperty({
    description: 'id description',
    example: 'DEP123456 example',
  })
  id: number;

  @ApiProperty({ description: 'name description', example: 'book name 1' })
  name: string;

  @ApiProperty({ description: `book's author`, example: 'author name 1' })
  author: string;

  @ApiProperty({ description: `book's publisher`, example: 'publisher name 1' })
  publisher: string;

  @ApiProperty({
    description: `book's publication date`,
    example: 'publication date example',
  })
  publication_date: Date;

  @ApiProperty({ description: `book's page count`, example: '500' })
  page_count: number;

  @ApiProperty({ description: 'created at', example: '2025-04-01' })
  created_at: Date;

  @ApiProperty({ description: 'updated at', example: '2025-07-01' })
  updated_at: Date;

  @ApiProperty({
    description: 'categories description',
    isArray: true, // optional, but explicit that this is an array
    example: [
      {
        category: {
          id: 1,
          name: 'name-1',
        },
      },
      {
        category: {
          id: 3,
          name: 'name-3',
        },
      },
    ],
  })
  categories: GetBookCategoryDTO[];

  constructor(book: Book) {
    this.id = book.id;
    this.name = book.name;
    this.author = book.author;
    this.publisher = book.publisher;
    this.publication_date = book.publication_date;
    this.page_count = book.page_count;
    this.created_at = book.created_at;
    this.updated_at = book.updated_at;

    this.categories = book.bookCategories?.map(
      (bookCategory: GetBookCategoryDTO) => ({
        category: {
          id: bookCategory.category.id,
          name: bookCategory.category.name,
        },
      }),
    );
  }
}
