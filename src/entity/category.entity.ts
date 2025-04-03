import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BookCategory } from './book.categories.entity';
import { CommonDatesEntity } from './common.dates.entity';

@Entity('category')
export class Category extends CommonDatesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @Index()
  @Column({
    name: 'name',
    length: 255,
    // nullable: false,
    // unique: false,
    // default: 'Anonymous',
    // comment: 'category name',
  })
  name: string;

  @OneToMany(() => BookCategory, (bookCategory) => bookCategory.category)
  bookCategories: BookCategory[];
}
