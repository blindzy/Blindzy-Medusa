import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity({ tableName: 'product' })
export class StandardProduct {
  @PrimaryKey()
  id: string

  @Property()
  title: string

  @Property({ nullable: true })
  subtitle?: string

  @Property({ nullable: true })
  description?: string

  @Property()
  handle: string

  @Property({ default: false })
  is_giftcard: boolean

  @Property({ default: 'draft' })
  status: string

  @Property({ nullable: true })
  thumbnail?: string

  @Property({ nullable: true })
  weight?: string

  @Property({ nullable: true })
  length?: string

  @Property({ nullable: true })
  height?: string

  @Property({ nullable: true })
  width?: string

  @Property({ nullable: true })
  origin_country?: string

  @Property({ nullable: true })
  hs_code?: string

  @Property({ nullable: true })
  mid_code?: string

  @Property({ nullable: true })
  material?: string

  @Property({ nullable: true })
  collection_id?: string

  @Property({ nullable: true })
  type_id?: string

  @Property({ default: true })
  discountable: boolean

  @Property({ nullable: true })
  external_id?: string

  @Property()
  created_at: Date

  @Property()
  updated_at: Date

  @Property({ nullable: true })
  deleted_at?: Date

  @Property({ type: 'json', nullable: true })
  metadata?: any

  constructor(data: Partial<StandardProduct> = {}) {
    Object.assign(this, data)
  }
}
