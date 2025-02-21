import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ENTITY_CONSTANTS } from '../constants/entity.constants';

@Entity(ENTITY_CONSTANTS.TABLE_NAMES.GROCERY)
export class Grocery extends BaseEntity {
  @Column(ENTITY_CONSTANTS.GROCERY_NAME_UNIQUE)
  name: string;

  @Column(ENTITY_CONSTANTS.GROCERY_PRICE)
  price: number;

  @Column(ENTITY_CONSTANTS.GROCERY_QUANTITY)
  quantity: number;

  @Column()
  image: string;
}
