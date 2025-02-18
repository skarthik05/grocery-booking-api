import { Controller, Post, Body, Headers } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExampleOrderResponses } from './responses/example-order-responses';
import { ROUTES } from '../constants/app.constants';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IdResponseDto } from 'src/common/dto/api.response.dto';
import { RedisService } from 'src/common/services/redis/redis.service';
import { ALL_ROLES } from 'src/constants/app.constants';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags(ROUTES.ORDERS)
@Controller(ROUTES.ORDERS)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly redisService: RedisService,
  ) {}

  @Post()
  @ApiHeader({
    name: 'idempotency-key',
    required: true,
    description: 'Unique key to prevent duplicate order creation',
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    schema: { example: ExampleOrderResponses.createOrderSuccess },
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    content: {
      'application/json': {
        examples: {
          generalError: {
            summary: 'Something went wrong',
            value: ExampleOrderResponses.createOrderError,
          },
          invalidGroceryIds: {
            summary: 'Invalid grocery IDs',
            value: ExampleOrderResponses.createOrderErrorInvalidGroceryIds,
          },
          insufficientStock: {
            summary: 'Insufficient stock',
            value: ExampleOrderResponses.createOrderErrorInsufficientStock,
          },
        },
      },
    },
  })
  @Roles(...ALL_ROLES)
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser('id') id: number,
    @Headers('idempotency-key') idempotencyKey: string,
  ): Promise<IdResponseDto> {
    const idempotencyKeyData = await this.redisService.get(idempotencyKey);
    if (idempotencyKeyData) {
      return { id: idempotencyKeyData };
    }
    return this.ordersService.createOrder(createOrderDto, id, idempotencyKey);
  }
}
