import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 as uuidv4 } from 'uuid'

@Entity({ tableName: 'customization_value' })
export class CustomizationValue {
  @PrimaryKey()
  id: string = uuidv4()

  @Property()
  option_id: string

  @Property()
  value: string

  @Property({ nullable: true })
  image_url?: string

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  additional_price?: number

  constructor(data: Partial<CustomizationValue> = {}) {
    Object.assign(this, data)
  }
}
