import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BookCategory } from './book.categories.entity';
import { CommonDatesEntity } from './common.dates.entity';

@Entity('book')
export class Book extends CommonDatesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @Index()
  // @Index('ft_idx_book_name', { fulltext: true })
  @Column({ name: 'name', length: 255 })
  name: string;

  @Column({ name: 'author', length: 255 })
  author: string;

  @Column({ name: 'publisher', length: 255, nullable: true })
  publisher: string;

  @Column({ name: 'publication_date', nullable: true })
  publication_date: Date;

  @Column({ name: 'page_count', nullable: true })
  page_count: number;

  @OneToMany(() => BookCategory, (bookCategory) => bookCategory.book)
  bookCategories: BookCategory[];
}
