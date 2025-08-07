import { MikroORM } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { Customer } from '../entities/customer.entity'
import { Otp } from '../entities/otp.entity'
import { CustomerAddress } from '../entities/customer-address.entity' 
import { Card } from '../entities/card.entity'
import { UserOrder } from "../entities/user-order.entity"
import { Cart } from "../entities/cart.entity";
import { CartItem } from "../entities/cart-item.entity";
import { Sample } from "../entities/sample.entity"
import { Product } from "../entities/product.entity"  
import { CustomizationOption } from "../entities/customization_option.entity"
import { CustomizationValue } from "../entities/customization_value.entity"

export const initORM = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>({
    driver: PostgreSqlDriver,
    clientUrl: process.env.DATABASE_URL,
    entities: [Customer, Otp, CustomerAddress, Card, UserOrder, Cart, CartItem, Sample, Product, CustomizationOption, CustomizationValue ], 
    forceEntityConstructor: true,
  })

  return orm
}
