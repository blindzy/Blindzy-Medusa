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

    // 1️⃣ Load cart and its items
    const cart = await em.findOne(Cart, { customer: customer_id }, { populate: ["items"] as any })
    if (!cart || !cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // 2️⃣ Load address (optional)
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

    // 3️⃣ Resolve modules
    const orderModule: any = req.scope.resolve(Modules.ORDER)
    const paymentModule: any = req.scope.resolve(Modules.PAYMENT)

    // 4️⃣ Determine currency
    const firstItemCurrency = cart.items?.[0]?.customizations?.currency ?? "AUD"
    const currencyMap: Record<string, string> = { "€": "eur", $: "usd", AUD: "aud", "£": "gbp" }
    const currency_code = currencyMap[firstItemCurrency] ?? "aud"

    // 5️⃣ Prepare order items
    const orderItems = cart.items.map((it: any) => ({
      title: it.customizations?.title ?? "Custom Product",
      quantity: it.quantity ?? 1,
      unit_price:
        typeof it.customizations?.amount === "number"
          ? it.customizations.amount
          : 0,
      metadata: it.customizations ?? {},
    }))

    // 6️⃣ Create the order
    const [order] = await orderModule.createOrders([
      {
        customer_id,
        email: cart.email ?? "guest@example.com",
        status: "completed",
        fulfillment_status: "not_fulfilled",
        payment_status: "pending", // temporarily pending
        currency_code,
        items: orderItems,
        shipping_address: addressForOrder,
        billing_address: addressForOrder,
        metadata: { custom_checkout: true },
      },
    ])

    // 7️⃣ Create payment collection + mark as paid
    const paymentCollection = await paymentModule.createPaymentCollections({
      region_id: "manual-region", // safe dummy id; not used by manual provider
      currency_code,
      amount: orderItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0),
      created_by: "api",
      metadata: { linked_order_id: order.id },
    })

    // Create the payment
    const payment = await paymentModule.createPayments({
      payment_collection_id: paymentCollection.id,
      currency_code,
      amount: paymentCollection.amount,
      provider_id: "manual",
      data: { paid_via: "external_gateway" },
    })

    // Capture (mark as paid)
    await paymentModule.capturePayment(payment.id)

    // Update order to reflect paid status
    await orderModule.updateOrders({ id: order.id }, { payment_status: "paid" })

    // 8️⃣ Clear cart after order creation
    await em.nativeDelete(CartItem, { cart: cart.id })

    // 9️⃣ Fetch the full order with payment details
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
