import { Entity, Property, PrimaryKey } from "@mikro-orm/core"

@Entity()
export class Otp {
  @PrimaryKey()
  id!: string

  @Property()
  email!: string

  @Property()
  otp!: string

  @Property()
  created_at: Date = new Date()
}
