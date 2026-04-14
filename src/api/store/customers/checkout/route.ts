import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Cart } from "../../../../entities/cart.entity"
import { CartItem } from "../../../../entities/cart-item.entity"
import { Modules } from "@medusajs/framework/utils"

export const config = { api: { bodyParser: true } }

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = req.body as {
      customer_id?: string
      address?: any
    }

    const { customer_id, address } = body

    if (!customer_id) {
      return res.status(400).json({ message: "Missing required field: customer_id" })
    }



    // ─── 1. Load cart ────────────────────────────────────────────────────────
    const orm = await initORM()
    const em = orm.em.fork()

    const cart = await em.findOne(
      Cart,
      { customer: customer_id },
      { populate: ["items"] as any }
    )

    if (!cart || !cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // ─── 2. Resolve address ──────────────────────────────────────────────────
    let addressForOrder = {
      first_name: "Customer",
      last_name: "",
      address_1: "N/A",
      address_2: "",
      city: "N/A",
      postal_code: "",
      country_code: "au",
      phone: "",
    }

    const normalizeCountry = (code?: string) => {
      if (!code) return "au"

      const map: Record<string, string> = {
        AUS: "au",
        USA: "us",
        GBR: "gb",
        CAN: "ca",
        NZL: "nz",
      }

      return (map[code] ?? code).toLowerCase()
    }

    if (address) {
      addressForOrder = {
        first_name: address.first_name ?? "Customer",
        last_name: address.last_name ?? "",
        address_1: address.address_1 ?? "N/A",
        address_2: address.address_2 ?? "",
        city: address.city ?? "N/A",
        postal_code: address.postal_code ?? "",
        country_code: normalizeCountry(address.country_code),
        phone: address.phone ?? "",
      }
    }
    // ─── 3. Resolve modules ──────────────────────────────────────────────────
    const orderModule: any = req.scope.resolve(Modules.ORDER)
    const paymentModule: any = req.scope.resolve(Modules.PAYMENT)
    const remoteLink: any = req.scope.resolve("remoteLink")

    // ─── 4. Prepare items & currency ─────────────────────────────────────────
    const currencyMap: Record<string, string> = {
      "€": "eur",
      "$": "usd",
      "A$": "aud",
      AUD: "aud",
      "£": "gbp",
    }
    const rawCurrency = cart.items?.[0]?.customizations?.currency ?? "AUD"
    const currency_code = currencyMap[rawCurrency] ?? "aud"

    const orderItems = cart.items.map((it: any) => ({
      title: it.customizations?.title ?? "Custom Product",
      quantity: it.quantity ?? 1,
      unit_price:
        typeof it.customizations?.amount === "number" ? it.customizations.amount : 0,
      metadata: it.customizations ?? {},
    }))

    const totalAmount = orderItems.reduce(
      (sum: number, item: any) => sum + item.unit_price * item.quantity,
      0
    )

    // ─── 5. Create the order (pending) ───────────────────────────────────────
    const [order] = await orderModule.createOrders([
      {
        customer_id,
        email: cart.email ?? "guest@example.com",
        status: "pending",
        currency_code,
        items: orderItems,
        shipping_address: addressForOrder,
        billing_address: addressForOrder,
        metadata: { custom_checkout: true },
      },
    ])

    // ─── 6. Create & link a payment collection ───────────────────────────────
    const paymentCollection = await paymentModule.createPaymentCollections({
      currency_code,
      amount: totalAmount,
    })

    await remoteLink.create({
      [Modules.ORDER]: { order_id: order.id },
      [Modules.PAYMENT]: { payment_collection_id: paymentCollection.id },
    })

    // ─── 7. Create a payment session (manual/system provider) ────────────────
    const paymentSession = await paymentModule.createPaymentSession(
      paymentCollection.id,
      {
        provider_id: "pp_system_default",
        currency_code,
        amount: totalAmount,
        data: {},
      }
    )

    // ─── 8. Authorize the session ────────────────────────────────────────────────
    await paymentModule.authorizePaymentSession(paymentSession.id, {})

    // ─── 9. Fetch the payment directly (don't trust authorizedSession.payment_id) ─
    const [payment] = await paymentModule.listPayments({
      payment_session_id: paymentSession.id,
    })

    if (!payment?.id) {
      throw new Error("Payment not found after authorization")
    }

    // ─── 10. Capture the payment ──────────────────────────────────────────────────
    await paymentModule.capturePayment({
      payment_id: payment.id,
      amount: totalAmount,
    })

    await paymentModule.completePaymentCollections(paymentCollection.id)

    // ─── 11. Clear cart ───────────────────────────────────────────────────────
    await em.nativeDelete(CartItem, { cart: cart.id })

    // ─── 12. Return full order ────────────────────────────────────────────────
    const fullOrder = await orderModule.retrieveOrder(order.id, {
      relations: ["items", "shipping_address", "billing_address"],
    })

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