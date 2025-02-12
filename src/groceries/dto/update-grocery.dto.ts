import { PartialType } from '@nestjs/mapped-types';
import { CreateGroceryDto } from './create-grocery.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateGroceryDto extends PartialType(CreateGroceryDto) {
  @ApiProperty({
    description: 'Name of the grocery item',
    required: false,
    example: 'Apple',
  })
  name?: string;

  @ApiProperty({
    description: 'Price of the grocery item',
    required: false,
    example: 1.99,
  })
  price?: number;

  @ApiProperty({
    description: 'Quantity of the grocery item',
    required: false,
    example: 10,
  })
  quantity?: number;
}
