import { ORDER_STATUS } from 'src/orders/constants/order.constants';
import { USER_ROLE } from 'src/users/constants/user.constants';
import { ColumnOptions } from 'typeorm';

export const ENTITY_CONSTANTS = {
  GROCERY_NAME_UNIQUE: { unique: true },
  GROCERY_PRICE: { type: 'decimal', precision: 10, scale: 2 } as ColumnOptions,
  GROCERY_QUANTITY: { type: 'int', default: 0 } as ColumnOptions,
  ORDER_TOTAL_PRICE: {
    type: 'decimal',
    precision: 10,
    scale: 2,
  } as ColumnOptions,
  ORDER_ITEM_QUANTITY: { type: 'int' } as ColumnOptions,
  ORDER_ITEM_SUBTOTAL: {
    type: 'decimal',
    precision: 10,
    scale: 2,
  } as ColumnOptions,
  TABLE_NAMES: {
    GROCERY: 'groceries',
    USER: 'users',
    ORDER: 'orders',
    ORDER_ITEM: 'order_items',
    ORDER_CANCELLATION: 'order_cancellations',
  },
  ORDER_STATUS: {
    type: 'enum',
    enum: ORDER_STATUS,
    default: ORDER_STATUS.PENDING,
  } as ColumnOptions,
  USER_ROLE: {
    type: 'enum',
    enum: USER_ROLE,
    default: USER_ROLE.USER,
  } as ColumnOptions,
};
