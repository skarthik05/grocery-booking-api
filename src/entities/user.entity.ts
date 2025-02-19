import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ENTITY_CONSTANTS } from 'src/constants/entity.constants';
import { Order } from './order.entity';
import { USER_ROLE } from 'src/users/constants/user.constants';

@Entity(ENTITY_CONSTANTS.TABLE_NAMES.USER)
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column(ENTITY_CONSTANTS.USER_ROLE)
  role: USER_ROLE;

  @Column({ default: false })
  isActive: boolean;

  @Column({ select: false })
  salt: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
