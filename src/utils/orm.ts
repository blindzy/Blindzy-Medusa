import { MikroORM } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { Customer } from '../entities/customer.entity'
import { Otp } from '../entities/otp.entity'

export const initORM = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    driver: PostgreSqlDriver,
    clientUrl: process.env.DATABASE_URL,
    entities: [Customer, Otp],
    forceEntityConstructor: true,
  })

  return orm
}