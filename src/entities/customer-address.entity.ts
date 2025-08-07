// src/entities/customer-address.entity.ts
import { Entity, PrimaryKey, Property } from "@mikro-orm/core"

@Entity({ tableName: "customer_address" })
export class CustomerAddress {
  @PrimaryKey()
  id: string

  @Property()
  customer_id: string

  @Property({ nullable: true })
  address_name?: string

  @Property({ nullable: true })
  company?: string

  @Property()
  first_name: string

  @Property()
  last_name: string

  @Property()
  address_1: string

  @Property({ nullable: true })
  address_2?: string

  @Property()
  city: string

  @Property()
  country_code: string

  @Property({ nullable: true })
  province?: string

  @Property()
  postal_code: string

  @Property({ nullable: true })
  phone?: string

  @Property({ nullable: true })
  house_no?: string

  @Property({ nullable: true })
  street_no?: string

  @Property({ nullable: true })
  house_type?: string

  @Property({ default: false })
  is_default_shipping: boolean

  @Property({ default: false })
  is_default_billing: boolean

  @Property({ type: "timestamptz", defaultRaw: "now()" })
  created_at: Date = new Date()

  @Property({ type: "timestamptz", defaultRaw: "now()", onUpdate: () => new Date() })
  updated_at: Date = new Date()
}
