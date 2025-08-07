import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Cart } from "../../../../entities/cart.entity"
import { CartItem } from "../../../../entities/cart-item.entity"
import { v4 as uuidv4 } from "uuid"

export const config = {
  api: {
    bodyParser: true,
  },
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { customer_id, card_id, address_id } = req.body ?? {}

    console.log("BODY:", req.body)

    if (!customer_id || !card_id || !address_id) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    // 1. Fetch cart with items
    const cart = await em.findOne(
      Cart,
      { customer: customer_id }, // MikroORM matches by ID under the hood
      { populate: ['items'] }
    )

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found" })
    }

    // 2. Calculate total price
    const total_price = cart.items.reduce((sum, item) => {
      const price = item.customizations?.price || 0
      return sum + price * item.quantity
    }, 0)

    // 3. Prepare order data
    const orderId = uuidv4()
    const itemsJson = JSON.stringify(
      cart.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        customizations: item.customizations,
      }))
    )

    // 4. Save order using raw SQL
    const result = await em.getConnection().execute(
      `
      INSERT INTO user_orders (
        id,
        customer_id,
        card_id,
        address_id,
        items,
        total_price,
        created_at,
        updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, now(), now()
      ) RETURNING *
    `,
      [
        orderId,
        customer_id,
        card_id,
        address_id,
        itemsJson,
        total_price,
      ]
    )

    // 5. Clear cart items
    await em.nativeDelete(CartItem, { cart: cart.id })

    return res.status(201).json({
      message: "Order placed successfully",
      order: result[0],
    })
  } catch (err) {
    console.error("Checkout error:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}
