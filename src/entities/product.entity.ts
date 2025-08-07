import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 as uuidv4 } from 'uuid'

@Entity({ tableName: 'custom_product' })
export class Product {
  @PrimaryKey()
  id: string = uuidv4()

  @Property()
  title: string

  @Property({ nullable: true })
  description?: string

  @Property()
  type: string // e.g., "Roller", "Vertical"

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  base_price: number

  @Property({ nullable: true })
  image_url?: string // Optional: PFP/main product image

  @Property({ onCreate: () => new Date() })
  created_at: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date()

  constructor(data: Partial<Product> = {}) {
    Object.assign(this, data)
  }
}
