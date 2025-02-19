import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ORDER_STATUS } from '../constants/order.constants';

export class ApproveOrderDto {
  @ApiProperty({
    description: 'New status for the order',
    enum: [ORDER_STATUS.SUCCESS, ORDER_STATUS.FAILED],
    example: ORDER_STATUS.SUCCESS,
  })
  @IsEnum([ORDER_STATUS.SUCCESS, ORDER_STATUS.FAILED])
  status: ORDER_STATUS;
}
