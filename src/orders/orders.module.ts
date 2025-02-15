import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrdersRepository } from './orders.repository';
import { GroceriesModule } from 'src/groceries/groceries.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), GroceriesModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
