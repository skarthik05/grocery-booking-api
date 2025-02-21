import {
  Controller,
  Post,
  Body,
  Headers,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { ExampleOrderResponses } from './responses/example-order-responses';
import { APP_ROLES, ROUTES } from '../constants/app.constants';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IdResponseDto } from '../common/dto/api.response.dto';
import { RedisService } from '../common/services/redis/redis.service';
import { ALL_ROLES } from '../constants/app.constants';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiCookieAuth } from '@nestjs/swagger';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { MessageResponseDto } from '../common/dto/api.response.dto';
import { ApproveOrderDto } from './dto/approve-order.dto';
@ApiCookieAuth()
@ApiTags(ROUTES.ORDERS)
@Controller(ROUTES.ORDERS)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly redisService: RedisService,
  ) {}

  @Get('my-orders')
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    schema: { example: ExampleOrderResponses.findAllOrdersSuccess },
  })
  @ApiResponse({
    status: 200,
    description: 'No orders found',
    schema: { example: ExampleOrderResponses.findAllOrdersEmpty },
  })
  getMyOrders(@CurrentUser('id') id: number) {
    return this.ordersService.getOrders(id);
  }
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

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({
    status: 200,
    description: 'Order cancelled successfully',
    schema: { example: ExampleOrderResponses.cancelOrderSuccess },
  })
  @ApiResponse({
    status: 400,
    description: 'Order cannot be cancelled',
    schema: { example: ExampleOrderResponses.cancelOrderError },
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    schema: { example: ExampleOrderResponses.findOrderError },
  })
  @Roles(...ALL_ROLES)
  async cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelOrderDto: CancelOrderDto,
    @CurrentUser('id') userId: number,
  ): Promise<MessageResponseDto> {
    return this.ordersService.cancelOrder(id, cancelOrderDto, userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (Vendor only)' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully',
    schema: { example: ExampleOrderResponses.updateOrderStatusSuccess },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid order status update',
    schema: { example: ExampleOrderResponses.updateOrderStatusError },
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found',
    schema: { example: ExampleOrderResponses.findOrderError },
  })
  @Roles(APP_ROLES.VENDOR)
  async updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveOrderDto: ApproveOrderDto,
  ): Promise<MessageResponseDto> {
    return this.ordersService.updateOrderStatus(id, approveOrderDto);
  }
}
