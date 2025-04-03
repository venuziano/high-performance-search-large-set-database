import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './controllers/book.controller';
import { BookService } from './services/book.service';
import { Book } from 'src/entity/book.entity';
import { BookCategory } from 'src/entity/book.categories.entity';
import { Category } from 'src/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, BookCategory, Category])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
