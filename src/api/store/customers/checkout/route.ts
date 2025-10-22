import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Cart } from "../../../../entities/cart.entity"
import { CartItem } from "../../../../entities/cart-item.entity"
import { Modules } from "@medusajs/framework/utils"

export const config = { api: { bodyParser: true } }

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = req.body as {
      customer_id: string
      address?: {
        first_name?: string
        last_name?: string
        address_1?: string
        city?: string
        postal_code?: string
        country_code?: string
      }
    }

    const { customer_id, address } = body
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
    const paymentModule: any = req.scope.resolve(Modules.PAYMENT)

    // 🪙 Determine currency (default to AUD)
    const firstItemCurrency = cart.items[0]?.customizations?.currency || "AUD"
    const currencyMap: Record<string, string> = {
      "€": "eur",
      "$": "usd",
      "AUD": "aud",
      "£": "gbp",
    }
    const currency_code = currencyMap[firstItemCurrency] || "aud"

    // ✅ Build order items
    const orderItems = cart.items.map((item: any) => ({
      title: item.customizations?.title || "Custom Product",
      quantity: item.quantity,
      unit_price: item.customizations?.amount || 0,
      metadata: item.customizations || {},
    }))

    // ✅ Create order
    const [order] = await orderModule.createOrders([
      {
        customer_id,
        email: cart.email || "guest@example.com",
        status: "completed",
        fulfillment_status: "fulfilled",
        payment_status: "awaiting",
        currency_code,
        items: orderItems,
        shipping_address: address || {
          first_name: "Default",
          last_name: "Customer",
          address_1: "123 Main Street",
          city: "Sydney",
          postal_code: "2000",
          country_code: "au",
        },
        billing_address: address || {
          first_name: "Default",
          last_name: "Customer",
          address_1: "123 Main Street",
          city: "Sydney",
          postal_code: "2000",
          country_code: "au",
        },
        metadata: { manually_paid: true, custom_checkout: true },
      },
    ])

    // ✅ Register payment manually
    await paymentModule.createPayments([
      {
        amount: order.total ?? 0,
        currency_code,
        order_id: order.id,
        provider_id: "manual", // use manual payment provider
        data: { paid_via: "external_gateway" },
        captured_at: new Date(),
      },
    ])

    // ✅ Update order to mark as paid
    await orderModule.updateOrders(
      { id: order.id },
      { payment_status: "paid" }
    )

    // 🧹 Clear the cart
    await em.nativeDelete(CartItem, { cart: cart.id })

    return res.status(201).json({
      message: "✅ Order placed and marked as paid successfully",
      order_id: order.id,
    })
  } catch (err) {
    console.error("❌ Checkout error:", err)
    return res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message,
    })
  }
}
