import { Entity, PrimaryKey, Property, JsonType } from "@mikro-orm/core"
import crypto from "crypto"

@Entity({ tableName: "user_orders" })
export class UserOrder {
  @PrimaryKey()
  id: string = crypto.randomUUID()

  @Property()
  customer_id: string

  @Property()
  card_id: string

  @Property()
  address_id: string

  @Property({ type: JsonType })
  items: {
    product_id: string
    quantity: number
    customizations: Record<string, any>
  }[]

  @Property({ nullable: true })
  total_price?: number

  @Property({ default: "pending" })
  status: string = "pending"

  @Property()
  created_at: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date()
}
