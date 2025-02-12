import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateGroceryDto {
  @ApiProperty({ description: 'Name of the grocery item', example: 'Apple' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => (value ? value.toLowerCase() : value))
  name: string;

  @ApiProperty({ description: 'Price of the grocery item', example: 1.99 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Quantity of the grocery item', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  quantity: number;
}
