//src/api/store/customers/checkout/route.ts

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Cart } from "../../../../entities/cart.entity"
import { CartItem } from "../../../../entities/cart-item.entity"
import { Modules } from "@medusajs/framework/utils"
import { Resend } from "resend"

//these are medusa defined keys
const SHIPPING_OPTION = "so_01KRN523S1GE6Y617DTM3CKTDM";
const REGION_ID = "reg_01KKGN42K937ZJAYC201CKP0H2";
const SALES_CHANNEL_ID = "sc_01KJYRF344TWVR9CVHJEY2M48Y";
const SHIPPING_NAME = "Shipping";
const LOCATION_ID = "sloc_01KRN4YRKK486X6ZGWEJVMN8R1";

const resend = new Resend(process.env.RESEND_API_KEY)

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
      unit_price: typeof it.customizations?.amount === "number" ? it.customizations.amount : 0,
      variant_id: it.variant_id ?? undefined,
      product_id: it.product_id ?? undefined,
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
        region_id: REGION_ID,
        sales_channel_id: SALES_CHANNEL_ID,
        items: orderItems,
        shipping_address: addressForOrder,
        billing_address: addressForOrder,
        shipping_methods: [
          {
            name: SHIPPING_NAME,
            amount: 0,
          }
        ],
        metadata: { custom_checkout: true },
      },
    ])

    // 5b reserve qty for inventory

    // ─── 5b. Create stock reservations ───────────────────────────────────────
    const inventoryModule: any = req.scope.resolve(Modules.INVENTORY)
    const query: any = req.scope.resolve("query")

    for (const item of order.items) {
      if (!item.variant_id) continue

      const { data: variants } = await query.graph({
        entity: "variant",
        fields: ["inventory_items.*"],
        filters: { id: item.variant_id },
      })

      const inventoryItemId = variants[0]?.inventory_items?.[0]?.inventory_item_id
      if (!inventoryItemId) continue

      await inventoryModule.createReservationItems([{
        line_item_id: item.id,
        inventory_item_id: inventoryItemId,
        location_id: LOCATION_ID,
        quantity: item.quantity,
      }])
    }

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

    // ─── 8. Authorize the session ────────────────────────────────────────────
    await paymentModule.authorizePaymentSession(paymentSession.id, {})

    // ─── 9. Fetch the payment ────────────────────────────────────────────────
    const [payment] = await paymentModule.listPayments({
      payment_session_id: paymentSession.id,
    })

    if (!payment?.id) {
      throw new Error("Payment not found after authorization")
    }

    // ─── 10. Capture the payment ─────────────────────────────────────────────
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

    // ─── 13. Send admin notification email ───────────────────────────────────
    const addr = addressForOrder
    const fullName = `${addr.first_name} ${addr.last_name}`.trim()
    const formattedAddress = [
      addr.address_1,
      addr.address_2,
      addr.city,
      addr.postal_code,
      addr.country_code.toUpperCase(),
    ]
      .filter(Boolean)
      .join(", ")

    const itemsTableRows = orderItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">${item.title}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            ${rawCurrency} ${(item.unit_price * item.quantity).toFixed(2)}
          </td>
        </tr>`
      )
      .join("")

    await resend.emails.send({
      from: "noreply@blindzy.com",
      to: "saif@team.aithur.com",
      subject: `🛒 New Order #${order.id} — ${fullName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <h2 style="background: #111; color: #fff; padding: 16px 20px; border-radius: 6px 6px 0 0; margin: 0;">
            New Order Received
          </h2>

          <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 6px 6px; padding: 24px;">

            <p style="margin: 0 0 4px;"><strong>Order ID:</strong> ${order.id}</p>
            <p style="margin: 0 0 4px;"><strong>Customer ID:</strong> ${customer_id}</p>
            <p style="margin: 0 0 4px;"><strong>Email:</strong> ${cart.email ?? "N/A"}</p>
            <p style="margin: 0 0 20px;"><strong>Phone:</strong> ${addr.phone || "N/A"}</p>

            <h3 style="margin: 0 0 8px; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px;">
              Delivery Address
            </h3>
            <p style="margin: 0 0 20px;">${fullName}<br/>${formattedAddress}</p>

            <h3 style="margin: 0 0 8px; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px;">
              Items Ordered
            </h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
              <thead>
                <tr style="background: #f9fafb;">
                  <th style="padding: 8px 12px; text-align: left;">Product</th>
                  <th style="padding: 8px 12px; text-align: center;">Qty</th>
                  <th style="padding: 8px 12px; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsTableRows}
              </tbody>
            </table>

            <p style="text-align: right; font-size: 16px; font-weight: bold; margin: 0;">
              Total: ${rawCurrency} ${(totalAmount).toFixed(2)}
            </p>

          </div>

          <p style="font-size: 12px; color: #9ca3af; margin-top: 16px; text-align: center;">
            Blindzy Admin Notification · Order placed at ${new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" })}
          </p>
        </div>
      `,
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