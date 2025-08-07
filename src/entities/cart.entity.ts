// src/entities/cart.entity.ts
import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core'
import { v4 } from 'uuid'
import { CartItem } from './cart-item.entity'
import { Customer } from './customer.entity'
import { ManyToOne } from '@mikro-orm/core'

@Entity({ tableName: 'cart' })
export class Cart {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4()

  @Property()
  email!: string

  @Property()
  currency_code: string = 'USD'

  @ManyToOne(() => Customer, { nullable: false })
  customer!: Customer   

  @OneToMany(() => CartItem, item => item.cart)
  items = new Collection<CartItem>(this)

  @Property()
  created_at: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date()
}
