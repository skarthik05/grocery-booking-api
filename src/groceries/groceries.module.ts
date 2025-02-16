import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroceriesService } from './groceries.service';
import { GroceriesController } from './groceries.controller';
import { GroceriesRepository } from './groceries.repository';
import { Grocery } from '../entities/grocery.entity';
import { SearchModule } from 'src/search/search.module';
@Module({
  imports: [TypeOrmModule.forFeature([Grocery]), SearchModule],
  controllers: [GroceriesController],
  providers: [GroceriesService, GroceriesRepository],
  exports: [GroceriesService, GroceriesRepository],
})
export class GroceriesModule {}
