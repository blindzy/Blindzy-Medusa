import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Cart } from "../../../../entities/cart.entity"
import { CartItem } from "../../../../entities/cart-item.entity"
import { Modules } from "@medusajs/framework/utils"

export const config = { api: { bodyParser: true } }

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    // 👇 Fix TS: req.body is unknown by default
    const body = req.body as { customer_id: string; address_id?: string; amount?: number }

    const { customer_id, address_id, amount } = body
    if (!customer_id) {
      return res.status(400).json({ message: "Missing required field: customer_id" })
    }

    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" })
    }

    // ✅ ORM
    const orm = await initORM()
    const em = orm.em.fork()

    // ✅ Get existing cart with items
    const cart = await em.findOne(
      Cart,
      { customer: customer_id },
      { populate: ["items"] }
    )

    if (!cart || !cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    const orderModule: any = req.scope.resolve(Modules.ORDER)

    // ✅ Build order items from your custom cart items
    const orderItems = cart.items.map((item: any) => ({
      title: item.customizations?.title || "Custom Product",
      quantity: item.quantity,
      unit_price: item.price,
      metadata: item.customizations || {},
    }))

    // ✅ Create a new order in Medusa
    const [order] = await orderModule.createOrders([
      {
        customer_id,
        email: cart.email || "guest@example.com",
        status: "completed",
        fulfillment_status: "fulfilled",
        payment_status: "captured",
        currency_code: "usd",
        items: orderItems,
        metadata: { manually_paid: true, custom_checkout: true },
      },
    ])

    // ✅ (Optional) Clear the cart after order creation
    await em.nativeDelete(CartItem, { cart: cart.id })

    return res.status(201).json({
      message: "✅ Order placed successfully",
      order,
    })
  } catch (err) {
    console.error("❌ Checkout error:", err)
    return res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message,
    })
  }
}
