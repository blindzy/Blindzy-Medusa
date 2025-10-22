import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { completeCartWorkflow } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"

export const config = { api: { bodyParser: true } }

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { customer_id, address_id } = req.body as {
      customer_id: string
      address_id: string
    }

    if (!customer_id || !address_id) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const cartModule: any = req.scope.resolve(Modules.CART)
    const orderModule: any = req.scope.resolve(Modules.ORDER)

    // Find cart for customer
    const carts = await cartModule.listCarts(
      { customer_id },
      { relations: ["items"] }
    )
    if (!carts?.length) {
      return res.status(400).json({ message: "No active cart found for this customer" })
    }

    const cart = carts[0]
    if (!cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // Update cart with address
    await cartModule.updateCarts(cart.id, {
      shipping_address_id: address_id,
    })

    // Complete cart -> create order
    const completeResult: any = await completeCartWorkflow(req.scope).run({
      input: { id: cart.id },
    })

    // Dynamically extract order ID
    let orderId: string | undefined
    if (completeResult) {
      if (completeResult.result) {
        const r = completeResult.result
        if (typeof r === "object") {
          if (r.id && typeof r.id === "string") {
            orderId = r.id
          } else if (r.order && r.order.id && typeof r.order.id === "string") {
            orderId = r.order.id
          }
        }
      }
      if (!orderId && typeof completeResult.id === "string") {
        orderId = completeResult.id
      }
      if (!orderId && completeResult.order && typeof completeResult.order.id === "string") {
        orderId = completeResult.order.id
      }
    }

    if (!orderId) {
      return res.status(500).json({
        message: "Could not determine order ID from workflow result",
        debug: completeResult,
      })
    }

    // Retrieve full order (so it appears in dashboard)
    const persistedOrder = await orderModule.retrieveOrder(orderId)

    if (!persistedOrder) {
      return res.status(500).json({ message: "Failed to retrieve created order" })
    }

    // Mark as paid via metadata (safe type)
    const [updatedOrder] = await orderModule.updateOrders(
      { id: persistedOrder.id } as any,
      {
        status: "completed",
        metadata: { manually_paid: true },
      } as any
    )

    return res.status(201).json({
      message: "Order placed successfully and marked as paid",
      order: updatedOrder ?? persistedOrder,
    })
  } catch (err) {
    console.error("Checkout error:", err)
    return res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message,
    })
  }
}
