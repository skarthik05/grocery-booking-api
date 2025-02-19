import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelOrderDto {
  @ApiProperty({
    description: 'Reason for cancelling the order',
    example: 'Changed my mind about the quantities',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  reason: string;
}
