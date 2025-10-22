import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Cart } from "../../../../entities/cart.entity"
import { CartItem } from "../../../../entities/cart-item.entity"
import { Modules } from "@medusajs/framework/utils"

export const config = { api: { bodyParser: true } }

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = req.body as { customer_id: string; address_id?: string }
    const { customer_id } = body

    if (!customer_id) {
      return res.status(400).json({ message: "Missing required field: customer_id" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    const cart = await em.findOne(Cart, { customer: customer_id }, { populate: ["items"] })

    if (!cart || !cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    const orderModule: any = req.scope.resolve(Modules.ORDER)

    // 🪙 Determine currency (default to AUD)
    const firstItemCurrency = cart.items[0]?.customizations?.currency || "AUD"
    const currencyMap: Record<string, string> = {
      "€": "eur",
      "$": "usd",
      "AUD": "aud",
      "£": "gbp",
    }
    const currency_code = currencyMap[firstItemCurrency] || "aud"

    // ✅ Build order items using your actual price (no *100)
    const orderItems = cart.items.map((item: any) => ({
      title: item.customizations?.title || "Custom Product",
      quantity: item.quantity,
      unit_price: item.customizations?.amount || 0, // amount = 200 means $200
      metadata: item.customizations || {},
    }))

    const [order] = await orderModule.createOrders([
      {
        customer_id,
        email: cart.email || "guest@example.com",
        status: "completed",
        fulfillment_status: "fulfilled",
        payment_status: "paid", // ✅ Mark as fully paid
        currency_code,
        items: orderItems,
        metadata: { manually_paid: true, custom_checkout: true },
      },
    ])

    // 🧹 Clear cart items (optional)
    await em.nativeDelete(CartItem, { cart: cart.id })

    return res.status(201).json({
      message: "✅ Order placed successfully (already paid)",
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
