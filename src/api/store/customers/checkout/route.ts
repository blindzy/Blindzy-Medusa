import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Cart } from "../../../../entities/cart.entity"
import { CartItem } from "../../../../entities/cart-item.entity"
import { Modules } from "@medusajs/framework/utils"

export const config = { api: { bodyParser: true } }

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = req.body as { customer_id: string; address_id?: string }

    const { customer_id, address_id } = body
    if (!customer_id) {
      return res.status(400).json({ message: "Missing required field: customer_id" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    // ✅ Load cart
    const cart = await em.findOne(Cart, { customer: customer_id }, { populate: ["items"] })
    if (!cart || !cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    const orderModule: any = req.scope.resolve(Modules.ORDER)

    // ✅ Get address (if exists)
    let address = undefined
    if (address_id) {
      const AddressEntity = em.getMetadata().find(e => e.className === "Address")?.class
      if (AddressEntity) {
        address = await em.findOne(AddressEntity, { id: address_id })
      }
      if (!address) {
        return res.status(400).json({ message: "Invalid address_id" })
      }
    }

    // ✅ Determine currency
    const firstItemCurrency = cart.items[0]?.customizations?.currency || "AUD"
    const currencyMap: Record<string, string> = {
      "€": "eur",
      "$": "usd",
      "AUD": "aud",
      "£": "gbp",
    }
    const currency_code = currencyMap[firstItemCurrency] || "aud"

    // ✅ Create order items
    const orderItems = cart.items.map((item: any) => ({
      title: item.customizations?.title || "Custom Product",
      quantity: item.quantity,
      unit_price: Math.round(item.customizations?.amount ?? 0),
      metadata: item.customizations || {},
    }))

    // ✅ Create the order directly
    const [order] = await orderModule.createOrders([
      {
        customer_id,
        email: cart.email || "guest@example.com",
        status: "completed",
        fulfillment_status: "not_fulfilled",
        payment_status: "paid", // 👈 directly mark as paid
        currency_code,
        items: orderItems,
        shipping_address: address,
        billing_address: address,
        metadata: { manually_paid: true, custom_checkout: true },
      },
    ])

    // ✅ Optional: Clear cart
    await em.nativeDelete(CartItem, { cart: cart.id })

    return res.status(201).json({
      message: "✅ Order placed successfully (marked as paid)",
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
