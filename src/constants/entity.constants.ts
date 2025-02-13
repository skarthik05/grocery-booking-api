import { ColumnOptions } from 'typeorm';

export const ENTITY_CONSTANTS = {
  GROCERY_NAME_UNIQUE: { unique: true },
  GROCERY_PRICE: { type: 'decimal', precision: 10, scale: 2 } as ColumnOptions,
  GROCERY_QUANTITY: { type: 'int', default: 0 } as ColumnOptions,
  TABLE_NAMES: {
    GROCERY: 'groceries',
    USER: 'users',
    ORDER: 'orders',
    ORDER_ITEM: 'order_items',
  },
};
