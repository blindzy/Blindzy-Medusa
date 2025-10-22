import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Cart } from "../../../../entities/cart.entity"
import { CartItem } from "../../../../entities/cart-item.entity"
import { completeCartWorkflow } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"

export const config = { api: { bodyParser: true } }

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { customer_id, address_id } = req.body as { customer_id: string; address_id: string }
    if (!customer_id || !address_id) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    const cart = await em.findOne(Cart, { customer: customer_id }, { populate: ["items"] })
    if (!cart || !cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty or not found" })
    }

    const cartModule = req.scope.resolve(Modules.CART)

    // Ensure shipping address is set
    await cartModule.updateCarts(cart.id, { shipping_address_id: address_id })

    // Complete the cart (creates the order)
    const { result: order } = await completeCartWorkflow(req.scope).run({
      input: { id: cart.id },
    })

    // ✅ Mark the order as paid manually
    const orderModule = req.scope.resolve(Modules.ORDER)
    const updatedOrder = await orderModule.updateOrders(order.id, {
      status: "completed",
    })

    // Optional: delete cart items (if your app needs it)
    await em.nativeDelete(CartItem, { cart: cart.id })

    return res.status(201).json({
      message: "Order placed successfully and marked as paid",
      order: updatedOrder,
    })
  } catch (err) {
    console.error("Checkout error:", err)
    return res.status(500).json({
      message: "Internal server error",
      error: (err as Error).message,
    })
  }
}
