import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export function PaginatedResponseDto<TItem>(itemDto: Type<TItem>): Type<any> {
  @ApiExtraModels(itemDto)
  class PaginatedResponseClass {
    @ApiProperty({
      type: 'array',
      items: { $ref: getSchemaPath(itemDto) },
    })
    data: TItem[];

    @ApiProperty({ description: 'Total number of items' })
    total: number;

    @ApiProperty({ description: 'Current page number' })
    page: number;

    @ApiProperty({ description: 'Total pages available' })
    totalPages: number;

    @ApiProperty({ description: 'Indicates if there is a next page' })
    hasNextPage: boolean;

    @ApiProperty({ description: 'Indicates if there is a previous page' })
    hasPreviousPage: boolean;
  }

  return PaginatedResponseClass;
}
