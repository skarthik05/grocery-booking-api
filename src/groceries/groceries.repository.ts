import { Injectable } from '@nestjs/common';
import { ILike, In, QueryRunner, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Grocery } from '../entities/grocery.entity';
import { CreateGroceryDto } from './dto/create-grocery.dto';
import { OrderItem } from 'src/entities/order-item.entity';
@Injectable()
export class GroceriesRepository {
  constructor(
    @InjectRepository(Grocery)
    private readonly repository: Repository<Grocery>,
  ) {}

  async create(createGroceryDto: CreateGroceryDto): Promise<Grocery> {
    const grocery = this.repository.create(createGroceryDto);
    const savedGrocery = await this.repository.save(grocery);
    return savedGrocery;
  }

  async findAll(): Promise<Grocery[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<Grocery> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: number, grocery: Grocery): Promise<Grocery> {
    return await this.repository.save(grocery);
  }

  async remove(id: number): Promise<UpdateResult> {
    return await this.repository.softDelete(id);
  }
  async isGroceryNameExists(name: string): Promise<boolean> {
    const grocery = await this.repository.findOne({
      where: { name: ILike(name) },
    });
    return !!grocery;
  }
  async findByIds(ids: number[]): Promise<Grocery[]> {
    return await this.repository.find({ where: { id: In(ids) } });
  }

  async bulkDecrementStock(
    items: OrderItem[],
    queryRunner: QueryRunner,
  ): Promise<void> {
    const caseQuery = items
      .map(
        (item) =>
          `WHEN id = ${item.grocery.id} THEN quantity - ${item.quantity}`,
      )
      .join(' ');

    await queryRunner.manager.query(`
      UPDATE groceries
      SET quantity = CASE ${caseQuery} END
      WHERE id IN (${items.map((i) => i.grocery.id).join(',')}) AND quantity >= 0;
    `);
  }
  async searchGroceries(query: string): Promise<Grocery[]> {
    return await this.repository.find({ where: { name: ILike(query) } });
  }
}
