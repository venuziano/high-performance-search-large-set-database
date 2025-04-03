import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from './book.entity';
import { Category } from './category.entity';

@Entity('book_categories')
export class BookCategory {
  @PrimaryColumn({ name: 'book_id' })
  bookId: number;

  @PrimaryColumn({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Book, (book) => book.bookCategories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Category, (category) => category.bookCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
