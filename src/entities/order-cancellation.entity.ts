import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
import { ENTITY_CONSTANTS } from '../constants/entity.constants';

@Entity(ENTITY_CONSTANTS.TABLE_NAMES.ORDER_CANCELLATION)
export class OrderCancellation extends BaseEntity {
  @OneToOne(() => Order)
  @JoinColumn()
  order: Order;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  cancelledAt: Date;
}
