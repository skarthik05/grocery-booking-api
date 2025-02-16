import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrdersRepository } from './orders.repository';
import { User } from 'src/entities/user.entity';
import { Grocery } from 'src/entities/grocery.entity';
import { IdResponseDto } from 'src/common/dto/api.response.dto';
import {
  InsufficientStockException,
  ResourceNotFoundException,
} from 'src/common/exceptions';
import { GroceriesRepository } from 'src/groceries/groceries.repository';
import { CustomLoggerService } from 'src/common/logger/logger.service';
import { RedisService } from 'src/common/services/redis/redis.service';
@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly groceriesRepository: GroceriesRepository,
    private readonly logger: CustomLoggerService,
    private readonly redisService: RedisService,
  ) {}

  async validateAndCalculateTotal(
    items: CreateOrderItemDto[],
  ): Promise<number> {
    this.logger.log('Validating and calculating total');
    const groceryIds = items.map((item) => item.groceryId);
    const groceries = await this.groceriesRepository.findByIds(groceryIds);
    if (groceries.length !== items.length) {
      this.logger.error('Invalid grocery IDs');
      throw new ResourceNotFoundException('Invalid grocery IDs');
    }
    this.logger.log('Checking stock availability');
    return await this.checkStockAvailability(groceries, items);
  }
  async checkStockAvailability(
    groceries: Grocery[],
    items: CreateOrderItemDto[],
  ): Promise<number> {
    let total = 0;
    const groceryMap = new Map<number, Grocery>();
    groceries.forEach((grocery) => groceryMap.set(grocery.id, grocery));

    for (const item of items) {
      const grocery = groceryMap.get(item.groceryId);

      if (grocery.quantity < item.quantity) {
        this.logger.error('Insufficient stock');
        throw new InsufficientStockException(grocery.name);
      }
      item.subtotal = item.quantity * grocery.price;
      this.logger.log('Calculating total');
      total += item.subtotal;
    }
    return total;
  }
  async createOrder(
    createOrderDto: CreateOrderDto,
    id: number,
    idempotencyKey: string,
  ): Promise<IdResponseDto> {
    this.logger.log('Creating order');
    try {
      if (!createOrderDto.items || createOrderDto.items.length === 0) {
        this.logger.error('Order must contain at least one item.');
        throw new BadRequestException('Order must contain at least one item.');
      }
      this.logger.log('Validating and calculating total');
      const totalPrice = await this.validateAndCalculateTotal(
        createOrderDto.items,
      );
      this.logger.log('Creating order object');
      const order = Object.assign(new Order(), {
        user: { id } as User,
        totalPrice,
        items: createOrderDto.items.map((item) =>
          Object.assign(new OrderItem(), {
            grocery: { id: item.groceryId } as Grocery,
            quantity: item.quantity,
            subtotal: item.subtotal,
          }),
        ),
      });
      this.logger.log('Creating order with transaction');
      const newOrder =
        await this.ordersRepository.createOrderWithTransaction(order);
      this.logger.log('Order created successfully');
      await this.redisService.set(idempotencyKey, newOrder.id);
      return { id: newOrder.id };
    } catch (error) {
      this.logger.error('Error creating order');
      throw error;
    }
  }
}
