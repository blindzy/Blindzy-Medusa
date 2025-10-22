// /src/api/store/customers/checkout/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { completeCartWorkflow } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"

/**
 * NOTE:
 * - This handler is written to be tolerant across Medusa 2.x module API differences.
 * - A few small 'as any' casts are used to avoid TypeScript mismatches that exist
 *   across minor Medusa releases (they don't change runtime behavior).
 * - Make sure you have a manual payment provider registered in medusa-config (see note below).
 */

export const config = { api: { bodyParser: true } }

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const {
      customer_id,
      region_id,
      address_id,
      items,
    } = req.body as {
      customer_id: string
      region_id: string
      address_id: string
      // minimal item shape from client
      items: { variant_id: string; quantity: number }[]
    }

    if (!customer_id || !region_id || !address_id || !items?.length) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Resolve core modules (module names are stable)
    const cartModule: any = req.scope.resolve(Modules.CART)
    const orderModule: any = req.scope.resolve(Modules.ORDER)
    const productModule: any = req.scope.resolve(Modules.PRODUCT)
    const pricingModule: any = req.scope.resolve(Modules.PRICING)

    //
    // 1) Build line items with title and unit_price.
    //    Different Medusa versions expose pricing in different methods.
    //    We attempt to use the pricing module when available; otherwise
    //    fall back to variant.price if present. All calls are guarded.
    //
    const lineItems = await Promise.all(
      items.map(async (it) => {
        // get base variant info (title, maybe some price info)
        const variant = await productModule.retrieveProductVariant(it.variant_id).catch(() => null)

        // try to calculate a price via pricingModule if available
        let unit_price = 0
        try {
          // The exact signature of calculatePrices / listPrices changed across v2.x.
          // We call calculatePrices if it exists; we cast filters to any to avoid TS errors.
          if (pricingModule && typeof pricingModule.calculatePrices === "function") {
            // cast filters to any to avoid a compile-time mismatch across versions
            const priceResult = await pricingModule.calculatePrices({
              variant_id: it.variant_id,
              region_id,
            } as any).catch(() => null)

            // Several medusa versions return different shapes; attempt to extract common fields:
            // - priceResult may be an array (first entry) or object with calculated_amount
            if (Array.isArray(priceResult) && priceResult.length > 0) {
              unit_price =
                (priceResult[0] && (priceResult[0].calculated_amount ?? priceResult[0].amount ?? 0)) || 0
            } else if (priceResult && typeof priceResult === "object") {
              unit_price = (priceResult.calculated_amount ?? priceResult.amount ?? 0) as number
            }
          } else if (variant) {
            // fallback to any price property on variant (older APIs)
            unit_price =
              (variant?.calculated_price ??
                variant?.calculated_price_including_tax ??
                variant?.prices?.[0]?.amount ??
                variant?.price ??
                0) as number
          }
        } catch {
          unit_price = 0
        }

        return {
          // Medusa CreateLineItem DTOs generally accept title + unit_price (and quantity)
          // and sometimes variant identifier fields — to be compatible with various versions
          // we provide common keys and cast the final cart payload as any later.
          title: (variant?.title as string) ?? "Product",
          variant_id: it.variant_id,
          quantity: it.quantity,
          unit_price,
        }
      })
    )

    //
    // 2) Create a Medusa cart using the cart module.
    //    Different Medusa releases accept either a single CreateCartDTO or an array.
    //    We normalize and cast to any to avoid compile-time mismatches.
    //
    let medusaCart: any = null

    // prefer the single-object create API if available; otherwise use createCarts
    if (typeof cartModule.createCarts === "function") {
      // createCarts often accepts either (CreateCartDTO) or (CreateCartDTO[])
      // We'll call it with a single object and cast to any to satisfy TS.
      medusaCart = await cartModule.createCarts({
        region_id,
        customer_id,
        currency_code: "usd", // ensure your region currency matches in production
        items: lineItems,
        shipping_address_id: address_id,
      } as any)
      // If createCarts returns array in this version, normalize:
      if (Array.isArray(medusaCart)) medusaCart = medusaCart[0]
    } else if (typeof cartModule.createCart === "function") {
      // older/fewer versions might expose createCart
      medusaCart = await cartModule.createCart({
        region_id,
        customer_id,
        currency_code: "usd",
        items: lineItems,
        shipping_address_id: address_id,
      } as any)
    } else {
      return res.status(500).json({
        message: "Cart module does not expose createCarts/createCart — incompatible Medusa version",
      })
    }

    if (!medusaCart?.id) {
      return res.status(500).json({ message: "Failed to create a Medusa cart" })
    }

    //
    // 3) Complete the cart using the official workflow. The workflow's output shape
    //    changed across versions: some return { id: orderId }, others return { result: orderDTO }.
    //    We handle both safely.
    //
    const completeResult: any = await completeCartWorkflow(req.scope).run({
      input: { id: medusaCart.id },
    })

    // attempt to extract order id from multiple possible shapes
    // - some versions: completeResult.result === orderDTO
    // - others: completeResult.result === { id: orderId } OR completeResult === { id: orderId }
    // - older: completeResult.result.order === orderDTO
    let orderId: string | undefined

    if (completeResult == null) {
      return res.status(500).json({ message: "completeCartWorkflow returned empty result" })
    }

    // try multiple extraction strategies:
    if (typeof completeResult === "object") {
      if (completeResult.result && typeof completeResult.result === "object") {
        // result might be OrderDTO or { id: string }
        if (completeResult.result.id) {
          orderId = completeResult.result.id
        } else if (completeResult.result.order && completeResult.result.order.id) {
          orderId = completeResult.result.order.id
        } else if (completeResult.result?.id) {
          orderId = completeResult.result.id
        } else {
          // maybe the workflow returned an OrderDTO directly in result
          orderId = (completeResult.result as any)?.id
        }
      } else if (completeResult.id) {
        orderId = completeResult.id
      } else if (completeResult.order && completeResult.order.id) {
        orderId = completeResult.order.id
      }
    }

    if (!orderId) {
      // Last resort: if workflow returned a scalar id
      if (typeof completeResult === "string") orderId = completeResult
    }

    if (!orderId) {
      return res.status(500).json({
        message:
          "Unable to determine order id from completeCartWorkflow result. Please check workflow output in your medusa version.",
        debug: completeResult,
      })
    }

    //
    // 4) Retrieve the persisted order from the order module (guarantees admin visibility)
    //
    const persistedOrder = await orderModule.retrieveOrder(orderId as string)

    if (!persistedOrder) {
      return res.status(500).json({ message: "Failed to retrieve created order" })
    }

    //
    // 5) Create a manual payment and capture it so the order shows as paid.
    //    Payment provider instances are registered dynamically; the typical key is "pp_manual"
    //    when using @medusajs/payment-manual. We cast provider to any for invocation.
    //
    //    IMPORTANT: Ensure you have the manual provider configured in medusa-config.ts.
    //
    let paymentCaptured = false
    try {
      // resolve 'pp_manual' provider (common naming for manual provider). If your provider has a different id, change it.
      const manualProvider: any = req.scope.resolve("pp_manual")

      if (manualProvider && typeof manualProvider.createPayment === "function") {
        // create payment
        const createdPayment = await manualProvider.createPayment({
          // provider-specific createPayment shape varies; common fields:
          amount: persistedOrder.total ?? persistedOrder.subtotal ?? 0,
          currency_code: persistedOrder.currency_code ?? "usd",
          context: { order_id: persistedOrder.id },
        } as any)

        // capture if provider supports capturePayment
        if (createdPayment && typeof manualProvider.capturePayment === "function") {
          await manualProvider.capturePayment(createdPayment.id)
        }

        paymentCaptured = true
      } else {
        // Try resolving by provider id "manual" (alternate naming)
        const altManual: any = req.scope.resolve("manual") || req.scope.resolve("manual_payment") || null
        if (altManual && typeof altManual.createPayment === "function") {
          const createdPayment = await altManual.createPayment({
            amount: persistedOrder.total ?? persistedOrder.subtotal ?? 0,
            currency_code: persistedOrder.currency_code ?? "usd",
            context: { order_id: persistedOrder.id },
          } as any)
          if (createdPayment && typeof altManual.capturePayment === "function") {
            await altManual.capturePayment(createdPayment.id)
          }
          paymentCaptured = true
        } else {
          // fallback: no payment provider available — continue without throwing
          paymentCaptured = false
        }
      }
    } catch (err) {
      // don't fail the whole flow for payment capture issues; we still have a created order persisted
      console.warn("Manual payment creation/capture failed (non-fatal):", (err as Error).message ?? err)
      paymentCaptured = false
    }

    //
    // 6) Update order metadata to reflect manual payment (not all versions allow payment_status in update)
    //
    try {
      // updateOrders(selector, data) — some versions accept selector object; some accept orderId then data.
      // Try both patterns.
      let updatedOrder: any = null
      if (typeof orderModule.updateOrders === "function") {
        try {
          // attempt selector-based update
          const out = await orderModule.updateOrders({ id: persistedOrder.id } as any, {
            status: "completed",
            metadata: { manually_paid: paymentCaptured },
          } as any)
          // updateOrders may return array or single record; normalize:
          if (Array.isArray(out)) updatedOrder = out[0]
          else updatedOrder = out
        } catch {
          // try (orderId, data) overload
          const out2 = await orderModule.updateOrders(persistedOrder.id as any, {
            status: "completed",
            metadata: { manually_paid: paymentCaptured },
          } as any)
          updatedOrder = out2
        }
      } else if (typeof orderModule.updateOrder === "function") {
        // alternate naming in some versions
        updatedOrder = await orderModule.updateOrder(persistedOrder.id, {
          status: "completed",
          metadata: { manually_paid: paymentCaptured },
        } as any)
      } else {
        updatedOrder = persistedOrder
      }

      // Return the updated order (or the persisted order if update not available)
      return res.status(201).json({
        message: "Order placed successfully",
        order: updatedOrder ?? persistedOrder,
        paid: paymentCaptured,
      })
    } catch (err) {
      // if update fails, still return the persisted order
      return res.status(201).json({
        message: "Order placed, but order update failed (order is persisted and visible in admin)",
        order: persistedOrder,
        paid: paymentCaptured,
        update_error: (err as Error).message ?? err,
      })
    }
  } catch (err) {
    console.error("Checkout error:", err)
    return res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message ?? err,
    })
  }
}
