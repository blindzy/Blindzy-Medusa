import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class PasswordReset {
  @PrimaryKey()
  email: string

  @Property()
  otp: string

  @Property()
  createdAt: Date = new Date()
}
