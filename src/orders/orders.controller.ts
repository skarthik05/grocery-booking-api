import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExampleOrderResponses } from './responses/example-order-responses';
import { ROUTES } from '../constants/app.constants';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IdResponseDto } from 'src/common/dto/api.response.dto';

@ApiTags(ROUTES.ORDERS)
@Controller(ROUTES.ORDERS)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
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
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser('id') id: number,
  ): Promise<IdResponseDto> {
    return this.ordersService.createOrder(createOrderDto, id);
  }
}
