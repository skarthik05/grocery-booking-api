import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'The ID of the grocery item',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  groceryId: number;

  @ApiProperty({
    description: 'The quantity of the grocery item',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    description: 'The subtotal of the grocery item',
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  subtotal: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'The items in the order',
    example: [
      { groceryId: 1, quantity: 2 },
      { groceryId: 2, quantity: 1 },
    ],
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  items: CreateOrderItemDto[];

  @ApiProperty({
    description: 'The total price of the order',
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  totalPrice: number;
}
