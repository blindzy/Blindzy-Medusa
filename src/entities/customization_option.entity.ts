import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 as uuidv4 } from 'uuid'

@Entity({ tableName: 'customization_option' })
export class CustomizationOption {
  @PrimaryKey()
  id: string = uuidv4()

  @Property()
  product_id: string

  @Property()
  name: string

  @Property()
  input_type: string

  @Property()
  required: boolean

  constructor(data: Partial<CustomizationOption> = {}) {
    Object.assign(this, data)
  }
}
