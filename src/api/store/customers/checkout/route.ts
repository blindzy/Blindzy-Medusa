// /src/api/store/customers/checkout/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Cart } from "../../../../entities/cart.entity"
import { CartItem } from "../../../../entities/cart-item.entity"
import { CustomerAddress } from "../../../../entities/customer-address.entity"
import { Modules } from "@medusajs/framework/utils"

export const config = { api: { bodyParser: true } }

/**
 * Robust checkout endpoint that:
 * - Finds customer's custom cart (no extra params)
 * - Creates an Order (embedded address if provided)
 * - Creates PaymentCollection, PaymentSession, Payment
 * - Captures the payment (so Medusa dashboard shows Paid)
 *
 * This version is defensive about return shapes from paymentModule methods
 * (array vs single object) and falls back to listPayments if needed to
 * find the created payment id before capturing.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = req.body as { customer_id?: string; address_id?: string }
    const { customer_id, address_id } = body

    if (!customer_id) {
      return res.status(400).json({ message: "Missing required field: customer_id" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    // Load cart and items
    const cart = await em.findOne(Cart, { customer: customer_id }, { populate: ["items"] as any })
    if (!cart || !cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // Load optional address from your custom CustomerAddress entity
    let addressForOrder: any = undefined
    if (address_id) {
      try {
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
      } catch (e) {
        // ignore and fallback to default below
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

    // Resolve modules
    const orderModule: any = req.scope.resolve(Modules.ORDER)
    const paymentModule: any = req.scope.resolve(Modules.PAYMENT)

    // Determine currency
    const firstItemCurrency = cart.items?.[0]?.customizations?.currency ?? "AUD"
    const currencyMap: Record<string, string> = { "€": "eur", $: "usd", AUD: "aud", "£": "gbp" }
    const currency_code = currencyMap[firstItemCurrency] ?? "aud"

    // Build order items (we assume cart.customizations.amount is whole units like 200)
    const orderItems = cart.items.map((it: any) => ({
      title: it.customizations?.title ?? "Custom Product",
      quantity: it.quantity ?? 1,
      unit_price: typeof it.customizations?.amount === "number" ? it.customizations.amount : 0,
      metadata: it.customizations ?? {},
    }))

    const totalAmount = orderItems.reduce((sum: number, i: any) => sum + (i.unit_price || 0) * (i.quantity || 1), 0)

    // Create order
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

    // Create payment collection (normalize return)
    const maybeCollection = await paymentModule.createPaymentCollections({
      currency_code,
      amount: totalAmount,
      created_by: "api",
      metadata: { linked_order_id: order.id },
    })
    const paymentCollection = Array.isArray(maybeCollection) ? maybeCollection[0] : maybeCollection

    if (!paymentCollection || !paymentCollection.id) {
      throw new Error("PaymentCollection creation failed or returned unexpected shape")
    }

    // Create payment session (normalize return)
    const maybeSession = await paymentModule.createPaymentSessions({
      payment_collection_id: paymentCollection.id,
      provider_id: "manual",
      amount: totalAmount,
      currency_code,
      data: { paid_via: "external_gateway" },
    })
    const paymentSession = Array.isArray(maybeSession) ? maybeSession[0] : maybeSession

    if (!paymentSession || !paymentSession.id) {
      throw new Error("PaymentSession creation failed or returned unexpected shape")
    }

    // Create payment (normalize return)
    const maybePayment = await paymentModule.createPayments({
      payment_collection_id: paymentCollection.id,
      payment_session_id: paymentSession.id,
      currency_code,
      amount: totalAmount,
      provider_id: "manual",
      data: { paid_via: "external_gateway" },
    })
    // createPayments might return an array or a single object depending on version
    const payment = Array.isArray(maybePayment) ? maybePayment[0] : maybePayment

    // If payment or payment.id missing, try to find created payment by listing payments on collection
    let paymentId: string | undefined = payment?.id ?? undefined
    if (!paymentId) {
      try {
        if (typeof paymentModule.listPayments === "function") {
          const list = await paymentModule.listPayments({ payment_collection_id: paymentCollection.id })
          if (Array.isArray(list) && list.length > 0) {
            paymentId = list[0]?.id
          }
        }
      } catch (e) {
        // ignore
      }
    } else {
      paymentId = payment.id
    }

    if (!paymentId) {
      // return a helpful error so you can see the raw responses in logs if needed
      const debug = {
        maybeCollection,
        maybeSession,
        maybePayment,
        totalAmount,
        paymentCollectionId: paymentCollection.id,
      }
      console.error("Payment creation debug:", debug)
      return res.status(500).json({
        message: "Payment creation failed to produce a payment id",
        debug,
      })
    }

    // Capture payment (ensure id provided)
    await paymentModule.capturePayment(paymentId)

    // Update order's payment status to paid so the dashboard reflects it
    await orderModule.updateOrders({ id: order.id }, { payment_status: "paid" })

    // Clear cart items
    await em.nativeDelete(CartItem, { cart: cart.id })

    // Retrieve and return full order
    const fullOrder = await orderModule.retrieveOrder(order.id)

    return res.status(201).json({
      message: "✅ Order placed successfully and marked as paid",
      order: fullOrder,
    })
  } catch (err) {
    console.error("Checkout error (final):", err)
    return res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message ?? err,
    })
  }
}
