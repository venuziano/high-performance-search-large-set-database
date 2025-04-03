import { ApiProperty } from '@nestjs/swagger';

export class GetBookCategoryDTO {
  @ApiProperty({ description: 'Category details' })
  category: {
    id: number;
    name: string;
  };
}
