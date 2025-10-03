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
import { StandardProduct } from "../entities/standard-product.entity"
import { CustomizationOption } from "../entities/customization_option.entity"
import { CustomizationValue } from "../entities/customization_value.entity"

export const initORM = async () => {
  let databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
  
  if (!databaseUrl) {
    throw new Error('No database URL found. Please set DATABASE_URL, POSTGRES_URL, or POSTGRES_PRISMA_URL environment variable.');
  }

  // Add SSL configuration to the connection URL to handle Supabase SSL issues
  if (databaseUrl.includes('supabase.com')) {
    const url = new URL(databaseUrl);
    url.searchParams.set('sslmode', 'require');
    url.searchParams.set('sslcert', '');
    url.searchParams.set('sslkey', '');
    url.searchParams.set('sslrootcert', '');
    databaseUrl = url.toString();
  }

  const orm = await MikroORM.init<PostgreSqlDriver>({
    driver: PostgreSqlDriver,
    clientUrl: databaseUrl,
    entities: [Customer, Otp, CustomerAddress, Card, UserOrder, Cart, CartItem, Sample, Product, StandardProduct, CustomizationOption, CustomizationValue ], 
    forceEntityConstructor: true,
    debug: process.env.NODE_ENV === 'development',
  })

  return orm
}
