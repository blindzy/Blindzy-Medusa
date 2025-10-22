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
      address_id?: string
    }

    const { customer_id, address_id } = body
    if (!customer_id) {
      return res.status(400).json({ message: "Missing required field: customer_id" })
    }

    // ORM
    const orm = await initORM()
    const em = orm.em.fork()

    // Find cart
    const cart = await em.findOne(Cart, { customer: customer_id }, { populate: ["items"] })
    if (!cart || !cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // Resolve modules
    const orderModule: any = req.scope.resolve(Modules.ORDER)
    const paymentModule: any = req.scope.resolve(Modules.PAYMENT)

    // Determine currency (defaults to AUD)
    const firstItemCurrency = cart.items[0]?.customizations?.currency || "AUD"
    const currencyMap: Record<string, string> = {
      "€": "eur",
      "$": "usd",
      "AUD": "aud",
      "£": "gbp",
    }
    const currency_code = currencyMap[firstItemCurrency] || "aud"

    // Build order items
    const orderItems = cart.items.map((item: any) => ({
      title: item.customizations?.title || "Custom Product",
      quantity: item.quantity,
      unit_price: item.customizations?.amount || 0,
      metadata: item.customizations || {},
    }))

    // Create order
    const [order] = await orderModule.createOrders([
      {
        customer_id,
        email: cart.email || "guest@example.com",
        status: "completed",
        fulfillment_status: "fulfilled",
        payment_status: "awaiting",
        currency_code,
        items: orderItems,
        shipping_address_id: address_id,
        billing_address_id: address_id,
        metadata: { manually_paid: true, custom_checkout: true },
      },
    ])

    // ✅ Create Payment Collection (required in Medusa v2)
    const [paymentCollection] = await paymentModule.createPaymentCollections([
      {
        type: "order",
        currency_code,
        amount: order.total ?? 0,
        region_id: order.region_id ?? null,
        order_id: order.id,
        status: "authorized",
      },
    ])

    // ✅ Register Payment under the Payment Collection
    await paymentModule.createPayments([
      {
        payment_collection_id: paymentCollection.id,
        amount: order.total ?? 0,
        currency_code,
        provider_id: "manual",
        data: { paid_via: "external_gateway" },
        captured_at: new Date(),
      },
    ])

    // ✅ Update order as paid
    await orderModule.updateOrders(
      { id: order.id },
      { payment_status: "paid" }
    )

    // Clear cart
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
