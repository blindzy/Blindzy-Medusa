import { Entity, PrimaryKey, Property } from "@mikro-orm/core"

@Entity({ tableName: "samples" })
export class Sample {
  @PrimaryKey()
  id!: string

  @Property()
  name!: string

  @Property()
  color!: string

  @Property()
  price!: number

  @Property()
  image!: string

  @Property()
  material!: string

  @Property()
  fabric!: string

  @Property()
  product!: string
}
