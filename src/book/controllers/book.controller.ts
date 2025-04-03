import {
  BadRequestException,
  Controller,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { getAllBooksDTO } from 'src/dto/book/get.all.book.dto';
import { PaginatedResponseDto } from 'src/dto/pagination/pagination.dto';
import { GetAllBooksPaginatedResponse } from 'src/types/pagination.types';
import { paginationLimit } from 'src/utils/pagination.util';
import { BookService } from '../services/book.service';

@Controller()
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get('book/get/all')
  @ApiOperation({ summary: 'Get all books' })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Optional filter string',
    type: String,
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    description: 'Max number of items to retrieve',
    type: Number,
    schema: { default: paginationLimit },
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: 'Current page number',
    type: Number,
    schema: { default: 1 },
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description:
      'Sort field (e.g., name, author, publisher, created_at, updated_at)',
    type: String,
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: 'Sort order, either ASC or DESC',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'List retrieved successfully!',
    type: PaginatedResponseDto(getAllBooksDTO),
  })
  @ApiBadRequestResponse({ description: 'Something went wrong' })
  async getAll(
    @Query('filter') filter: string = '',
    @Query('limit', ParseIntPipe) limit: number = paginationLimit,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ): Promise<GetAllBooksPaginatedResponse> {
    try {
      return await this.bookService.getAllBooks(
        limit,
        page,
        filter,
        sort,
        order,
      );
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException('somenthin went wrong');
    }
  }
}
