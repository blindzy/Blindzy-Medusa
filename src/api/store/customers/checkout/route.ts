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

    // ensure shipping info is set on the cart
    await cartModule.updateCarts(cart.id, { shipping_address_id: address_id })

    // complete the cart -> places the order
    const { result: order } = await completeCartWorkflow(req.scope).run({
      input: { id: cart.id },
    })

    // optional: clear cart items in your custom DB entities
    await em.nativeDelete(CartItem, { cart: cart.id })

    return res.status(201).json({ message: "Order placed successfully", order })
  } catch (err) {
    console.error("Checkout error:", err)
    return res.status(500).json({ message: "Internal server error", error: (err as Error).message })
  }
}
