import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Cart } from "../../../../entities/cart.entity"
import { CartItem } from "../../../../entities/cart-item.entity"
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
    const cart = await em.findOne(
      Cart,
      { customer: customer_id },
      { populate: ["items"] as any }
    )

    if (!cart || !cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // 2️⃣ Try to fetch address from your own address table if provided
    let addressForOrder: any = undefined
    if (address_id) {
      try {
        // Replace this entity name if your address entity is different
        const AddressEntity = await import("../../../../entities/address.entity").then(
          (m) => m.Address
        )
        const foundAddress = await em.findOne(AddressEntity, { id: address_id })
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
      } catch (err) {
        console.warn("⚠️ Address entity not found or failed to load:", err)
      }
    }

    // 3️⃣ Fallback if address not found
    if (!addressForOrder) {
      addressForOrder = {
        first_name: "Customer",
        last_name: "",
        address_1: "N/A",
        city: "N/A",
        country_code: "au",
      }
    }

    // 4️⃣ Resolve modules
    const orderModule: any = req.scope.resolve(Modules.ORDER)

    // 5️⃣ Determine currency from cart’s first item (fallback to AUD)
    const firstItemCurrency = cart.items?.[0]?.customizations?.currency ?? "AUD"
    const currencyMap: Record<string, string> = { "€": "eur", $: "usd", AUD: "aud", "£": "gbp" }
    const currency_code = currencyMap[firstItemCurrency] ?? "aud"

    // 6️⃣ Prepare order items from cart items
    const orderItems = cart.items.map((it: any) => ({
      title: it.customizations?.title ?? "Custom Product",
      quantity: it.quantity ?? 1,
      unit_price:
        typeof it.customizations?.amount === "number"
          ? it.customizations.amount
          : 0,
      metadata: it.customizations ?? {},
    }))

    // 7️⃣ Create the order directly marked as PAID
    const [order] = await orderModule.createOrders([
      {
        customer_id,
        email: cart.email ?? "guest@example.com",
        status: "completed",
        fulfillment_status: "not_fulfilled",
        payment_status: "paid", // ✅ Directly mark as paid
        currency_code,
        items: orderItems,
        shipping_address: addressForOrder,
        billing_address: addressForOrder,
        metadata: { custom_checkout: true },
      },
    ])

    // 8️⃣ Clear cart after successful order
    await em.nativeDelete(CartItem, { cart: cart.id })

    // 9️⃣ Retrieve full order to include address/payment info
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
