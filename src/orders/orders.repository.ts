import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { GroceriesRepository } from 'src/groceries/groceries.repository';
import { CustomLoggerService } from 'src/common/logger/logger.service';
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
}
