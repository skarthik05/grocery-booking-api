import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { GroceriesRepository } from 'src/groceries/groceries.repository';
import { CustomLoggerService } from 'src/common/logger/logger.service';
import { OrderCancellation } from '../entities/order-cancellation.entity';
import { ORDER_STATUS } from './constants/order.constants';
import { IFindOrderAndItems } from './interfaces/order.interface';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
    private readonly groceriesRepository: GroceriesRepository,
    private readonly dataSource: DataSource,
    private readonly logger: CustomLoggerService,
  ) {}

  async createOrderWithTransaction(newOrder: Order): Promise<{ id: number }> {
    this.logger.log('Creating order with transaction');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // const order = queryRunner.manager.create(Order, newOrder);
      this.logger.log('Creating order');
      const savedOrder = await queryRunner.manager.save(Order, newOrder);
      this.logger.log('Decrementing stock');
      await this.groceriesRepository.bulkDecrementStock(
        newOrder.items,
        queryRunner,
      );
      this.logger.log('Committing transaction');
      await queryRunner.commitTransaction();
      return { id: savedOrder.id };
    } catch (error) {
      this.logger.error('Rolling back transaction');
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      this.logger.log('Releasing query runner');
      await queryRunner.release();
    }
  }
  async findOrderWithItems(input: IFindOrderAndItems): Promise<Order[]> {
    this.logger.log('Finding orders for user ' + input.userId);
    const where: FindOptionsWhere<Order> = {};
    if (input.userId) {
      where.user = { id: input.userId };
    }
    if (input.id) {
      where.id = input.id;
    }
    const orders = await this.repository.find({
      where,
      relations: ['items', 'items.grocery', 'user'],
    });
    this.logger.log('Orders retrieved successfully');
    return orders;
  }

  async cancelOrder(order: Order, reason: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      order.status = ORDER_STATUS.CANCELLED;
      await queryRunner.manager.save(Order, order);

      const cancellation = queryRunner.manager.create(OrderCancellation, {
        order,
        reason,
        cancelledAt: new Date(),
      });
      await queryRunner.manager.save(OrderCancellation, cancellation);

      this.logger.log('Restoring stock quantities');
      await this.groceriesRepository.bulkIncrementStock(
        order.items,
        queryRunner,
      );

      this.logger.log('Cancellation record created successfully');
      this.logger.log('Committing transaction');

      await queryRunner.commitTransaction();
      this.logger.log('Transaction committed successfully');
    } catch (error) {
      this.logger.error('Rolling back transaction');
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      this.logger.log('Releasing query runner');
      await queryRunner.release();
    }
  }
}
