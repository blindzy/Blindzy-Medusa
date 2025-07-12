import { Entity, Property, PrimaryKey } from '@mikro-orm/core'
import { v4 as uuid } from 'uuid'

@Entity()
export class Customer {
    @PrimaryKey({ type: 'uuid' })
    id: string = uuid()

    @Property()
    first_name: string

    @Property()
    last_name: string

    @Property()
    email: string

    @Property({ nullable: true })
    phone?: string

    @Property({ nullable: true, unique: true })
    username?: string

    @Property({ default: false })
    has_account: boolean = true

    @Property({ nullable: true })
    password_hash?: string

    @Property({ onCreate: () => new Date() })
    created_at: Date = new Date()

    @Property({ onUpdate: () => new Date() })
    updated_at: Date = new Date()
}