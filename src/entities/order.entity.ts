import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { ENTITY_CONSTANTS } from '../constants/entity.constants';
import { ORDER_STATUS } from 'src/orders/constants/order.constants';

@Entity(ENTITY_CONSTANTS.TABLE_NAMES.ORDER)
export class Order extends BaseEntity {
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column(ENTITY_CONSTANTS.ORDER_TOTAL_PRICE)
  totalPrice: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @Column(ENTITY_CONSTANTS.ORDER_STATUS)
  status: ORDER_STATUS;
}
