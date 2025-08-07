// src/entities/cart-item.entity.ts
import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  JsonType,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ tableName: 'cart_item' })
export class CartItem {
  @PrimaryKey({ type: 'text' })
  id: string = v4();

  // defer loading Cart until runtime to break circular import
  @ManyToOne(
    () => {
      const { Cart } = require('./cart.entity');
      return Cart;
    },
    { nullable: false }
  )
  cart!: any;

  @Property()
  product_id!: string;

  @Property()
  quantity!: number;

  @Property({ type: JsonType })
  customizations!: Record<string, any>;

  @Property()
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date();
}
