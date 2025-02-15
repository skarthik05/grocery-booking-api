import { Injectable } from '@nestjs/common';
import { ILike, In, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Grocery } from '../entities/grocery.entity';
import { CreateGroceryDto } from './dto/create-grocery.dto';
import { UpdateGroceryDto } from './dto/update-grocery.dto';
import { OrderItem } from 'src/entities/order-item.entity';
@Injectable()
export class GroceriesRepository {
  constructor(
    @InjectRepository(Grocery)
    private readonly repository: Repository<Grocery>,
  ) {}

  async create(createGroceryDto: CreateGroceryDto): Promise<{ id: number }> {
    const grocery = this.repository.create(createGroceryDto);
    const savedGrocery = await this.repository.save(grocery);
    return { id: savedGrocery.id };
  }

  async findAll(): Promise<Grocery[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<Grocery> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateGroceryDto: UpdateGroceryDto,
  ): Promise<Grocery> {
    const grocery = await this.findOne(id);
    Object.assign(grocery, updateGroceryDto);
    return await this.repository.save(grocery);
  }

  async remove(id: number): Promise<Grocery> {
    const grocery = await this.findOne(id);
    return await this.repository.remove(grocery);
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
}
