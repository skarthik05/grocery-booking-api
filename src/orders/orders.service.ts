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
  InvalidDataException,
} from 'src/common/exceptions';
import { GroceriesRepository } from 'src/groceries/groceries.repository';
import { CustomLoggerService } from 'src/common/logger/logger.service';
import { RedisService } from 'src/common/services/redis/redis.service';
import { ORDER_STATUS } from './constants/order.constants';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { MessageResponseDto } from 'src/common/dto/api.response.dto';
import { ApproveOrderDto } from './dto/approve-order.dto';
@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly groceriesRepository: GroceriesRepository,
    private readonly logger: CustomLoggerService,
    private readonly redisService: RedisService,
  ) {}

  async getOrders(userId: number) {
    try {
      this.logger.log('Getting orders for user ' + userId);
      const orders = await this.ordersRepository.findOrderWithItems({
        userId,
      });
      this.logger.log('Orders retrieved successfully');
      return orders;
    } catch (error) {
      this.logger.error('Error getting orders');
      throw error;
    }
  }

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
        status: ORDER_STATUS.PENDING,
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
      return {
        id: newOrder.id,
        message: 'your order has been created successfully',
      };
    } catch (error) {
      this.logger.error('Error creating order');
      throw error;
    }
  }

  async cancelOrder(
    orderId: number,
    cancelOrderDto: CancelOrderDto,
    userId: number,
  ): Promise<MessageResponseDto> {
    this.logger.log(`Cancelling order ${orderId} for user ${userId}`);

    try {
      const order = await this.ordersRepository.findOrderWithItems({
        id: orderId,
        userId,
      });

      if (!order.length) {
        throw new ResourceNotFoundException('Order');
      }

      if (order[0].status !== ORDER_STATUS.PENDING) {
        throw new InvalidDataException('Only pending orders can be cancelled');
      }

      await this.ordersRepository.cancelOrder(order[0], cancelOrderDto.reason);

      this.logger.log(`Order ${orderId} cancelled successfully`);
      return {
        message: 'your order has been cancelled successfully',
      };
    } catch (error) {
      this.logger.customError(`Failed to cancel order ${orderId}`, error.stack);
      throw error;
    }
  }

  async updateOrderStatus(
    orderId: number,
    approveOrderDto: ApproveOrderDto,
  ): Promise<MessageResponseDto> {
    this.logger.log(
      `Updating order ${orderId} status to ${approveOrderDto.status}`,
    );

    try {
      const order = await this.ordersRepository.findOrderWithItems({
        id: orderId,
      });

      if (!order.length) {
        throw new ResourceNotFoundException('Order');
      }

      if (order[0].status !== ORDER_STATUS.PENDING) {
        throw new InvalidDataException('Can only update pending orders');
      }
      order[0].status = approveOrderDto.status;
      await this.ordersRepository.updateOrderStatus(order[0]);

      this.logger.log(`Order ${orderId} status updated successfully`);
      return {
        message: 'Order status updated successfully',
      };
    } catch (error) {
      this.logger.customError(
        `Failed to update order ${orderId} status`,
        error.stack,
      );
      throw error;
    }
  }
}
