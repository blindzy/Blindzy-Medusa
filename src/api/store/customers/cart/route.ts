import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Request, Response } from "express"
import { EntityManager } from "@mikro-orm/core"
import { Cart } from "../../../../entities/cart.entity"
import { CartItem } from "../../../../entities/cart-item.entity"
import { Customer } from "../../../../entities/customer.entity"
import { initORM } from "../../../../utils/orm"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { email, product_id, quantity, customizations } = req.body
  console.log('Cart POST request:', { email, product_id, quantity, customizations })
  
  const orm = await initORM()
  const em = orm.em.fork()

  if (!email || !product_id || !quantity) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  try {
    // Ensure cart_item table exists - create it outside transaction
    const connection = em.getConnection()
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cart_item (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        cart_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        customizations JSONB NOT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now()
      );
    `)
    console.log('cart_item table checked/created')
  } catch (error) {
    console.log('Table creation error (might already exist):', error)
  }

  // 1. Find customer by email
  let customer = await em.findOne(Customer, { email })
  if (!customer) {
    return res.status(404).json({ message: "Customer not found. Please register first." })
  }
  console.log('Customer found:', customer.id)

  // 2. Find or create cart
  let cart = await em.findOne(Cart, { customer })
  if (!cart) {
    cart = em.create(Cart, {
        email,
        customer,
        currency_code: 'USD',
        created_at: new Date(),
        updated_at: new Date(),
      })
      
    await em.persistAndFlush(cart)
    console.log('Cart created:', cart.id)
  } else {
    console.log('Cart found:', cart.id)
  }

  // 2. Add product to cart
  const cartItem = em.create(CartItem, {
    cart,
    product_id,
    quantity,
    customizations,
    created_at: new Date(),
    updated_at: new Date(),
  })
  

  await em.persistAndFlush(cartItem)

  return res.status(201).json({
    message: "Item added to cart",
    cart_id: cart.id,
    item_id: cartItem.id,
  })
}

export const GET = async (req: Request, res: Response) => {
  const email = req.query.email as string

  if (!email) {
    return res.status(400).json({ error: 'Missing email' })
  }

  const orm = await initORM()
  const em = orm.em.fork()

  // Find customer first
  const customer = await em.findOne(Customer, { email })
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' })
  }

  const cart = await em.findOne(
    Cart,
    { customer },
    { populate: ['items'] }
  )

  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' })
  }

  return res.status(200).json({
    cart: {
      id: cart.id,
      email: cart.email,
      customer: cart.customer?.id,
      created_at: cart.created_at,
      updated_at: cart.updated_at,
      items: cart.items.get().map((item) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        customizations: item.customizations,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })),
    },
  })
}

