import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Cart } from "../../../../entities/cart.entity"
import { CartItem } from "../../../../entities/cart-item.entity"
import { CustomerAddress } from "../../../../entities/customer-address.entity"
import { Modules } from "@medusajs/framework/utils"

export const config = { api: { bodyParser: true } }

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = req.body as { customer_id?: string; address_id?: string }
    const { customer_id, address_id } = body

    if (!customer_id) {
      return res.status(400).json({ message: "Missing required field: customer_id" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    // 🛒 1️⃣ Get existing cart with items
    const cart = await em.findOne(
      Cart,
      { customer: customer_id },
      { populate: ["items"] as any }
    )
    if (!cart || !cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // 📍 2️⃣ Get address (optional)
    let addressForOrder: any = undefined
    if (address_id) {
      const foundAddress = await em.findOne(CustomerAddress, { id: address_id })
      if (foundAddress) {
        addressForOrder = {
          first_name: foundAddress.first_name ?? "Customer",
          last_name: foundAddress.last_name ?? "",
          address_1: foundAddress.address_1 ?? "",
          address_2: foundAddress.address_2 ?? "",
          city: foundAddress.city ?? "",
          postal_code: foundAddress.postal_code ?? "",
          country_code: (foundAddress.country_code ?? "AU").toLowerCase(),
          phone: foundAddress.phone ?? "",
        }
      }
    }

    if (!addressForOrder) {
      addressForOrder = {
        first_name: "Customer",
        last_name: "",
        address_1: "N/A",
        city: "N/A",
        country_code: "au",
      }
    }

    // 🧩 3️⃣ Resolve modules
    const orderModule: any = req.scope.resolve(Modules.ORDER)
    const paymentModule: any = req.scope.resolve(Modules.PAYMENT)

    // 💱 4️⃣ Currency
    const firstItemCurrency = cart.items?.[0]?.customizations?.currency ?? "AUD"
    const currencyMap: Record<string, string> = {
      "€": "eur",
      $: "usd",
      AUD: "aud",
      "£": "gbp",
    }
    const currency_code = currencyMap[firstItemCurrency] ?? "aud"

    // 🧾 5️⃣ Order items
    const orderItems = cart.items.map((it: any) => ({
      title: it.customizations?.title ?? "Custom Product",
      quantity: it.quantity ?? 1,
      unit_price: typeof it.customizations?.amount === "number" ? it.customizations.amount : 0,
      metadata: it.customizations ?? {},
    }))

    const totalAmount = orderItems.reduce(
      (sum, i) => sum + i.unit_price * i.quantity,
      0
    )

    // 🧾 6️⃣ Create order (pending payment)
    const [order] = await orderModule.createOrders([
      {
        customer_id,
        email: cart.email ?? "guest@example.com",
        status: "completed",
        fulfillment_status: "not_fulfilled",
        payment_status: "pending",
        currency_code,
        items: orderItems,
        shipping_address: addressForOrder,
        billing_address: addressForOrder,
        metadata: { custom_checkout: true },
      },
    ])

    // 💰 7️⃣ Create payment collection + session + payment
    const paymentCollection = await paymentModule.createPaymentCollections({
      currency_code,
      amount: totalAmount,
      created_by: "api",
      metadata: { linked_order_id: order.id },
    })

    const session = await paymentModule.createPaymentSessions({
      currency_code,
      amount: totalAmount,
      provider_id: "manual",
      payment_collection_id: paymentCollection.id,
      data: { paid_via: "external_gateway" },
    })

    const payment = await paymentModule.createPayments({
      currency_code,
      amount: totalAmount,
      provider_id: "manual",
      payment_collection_id: paymentCollection.id,
      payment_session_id: session.id,
      data: { paid_via: "external_gateway" },
    })

    // ✅ Retrieve full entity before capturing (fixes “id must be defined”)
    const paymentEntity = await paymentModule.retrievePayment(payment.id)
    if (!paymentEntity?.id) {
      throw new Error(`Payment entity not found for id: ${payment.id}`)
    }

    // ✅ Capture payment and mark order as paid
    await paymentModule.capturePayment(paymentEntity)
    await orderModule.updateOrders({ id: order.id }, { payment_status: "paid" })

    // 🧹 8️⃣ Clear cart
    await em.nativeDelete(CartItem, { cart: cart.id })

    // 🔄 9️⃣ Fetch full order
    const fullOrder = await orderModule.retrieveOrder(order.id)

    return res.status(201).json({
      message: "✅ Order placed successfully and marked as paid",
      order: fullOrder,
    })
  } catch (err) {
    console.error("❌ Checkout error:", err)
    return res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message ?? err,
    })
  }
}
