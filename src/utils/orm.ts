import { MikroORM } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { Customer } from '../entities/customer.entity'
import { Otp } from '../entities/otp.entity'

export const initORM = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    driver: PostgreSqlDriver,
    dbName: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    entities: [Customer, Otp],
    forceEntityConstructor: true,
  })

  return orm
}
