import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrdersRepository } from './orders.repository';
import { GroceriesModule } from 'src/groceries/groceries.module';
import { RedisModule } from 'src/common/services/redis/redis.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    GroceriesModule,
    RedisModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
