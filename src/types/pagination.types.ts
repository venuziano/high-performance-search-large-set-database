import { getAllBooksDTO } from 'src/dto/book/get.all.book.dto';
import { PaginatedResponseDto } from 'src/dto/pagination/pagination.dto';

export type GetAllBooksPaginatedResponse = InstanceType<
  ReturnType<typeof PaginatedResponseDto<getAllBooksDTO>>
>;
