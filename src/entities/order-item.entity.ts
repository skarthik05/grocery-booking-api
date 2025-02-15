import { Entity, ManyToOne, Column } from 'typeorm';
import { Grocery } from './grocery.entity';
import { Order } from './order.entity';
import { BaseEntity } from './base.entity';
import { ENTITY_CONSTANTS } from '../constants/entity.constants';

@Entity(ENTITY_CONSTANTS.TABLE_NAMES.ORDER_ITEM)
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => Grocery)
  grocery: Grocery;

  @Column(ENTITY_CONSTANTS.ORDER_ITEM_QUANTITY)
  quantity: number;

  @Column(ENTITY_CONSTANTS.ORDER_ITEM_SUBTOTAL)
  subtotal: number;
}
