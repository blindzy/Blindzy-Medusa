import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Cart } from "../../../../entities/cart.entity"
import { CartItem } from "../../../../entities/cart-item.entity"

export const config = {
  api: {
    bodyParser: true,
  },
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { customer_id, address_id } = req.body ?? {}
    if (!customer_id || !address_id) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    // Fetch the cart
    const cart = await em.findOne(
      Cart,
      { customer: customer_id },
      { populate: ["items"] }
    )

    if (!cart || !cart.items?.length) {
      return res.status(400).json({ message: "Cart is empty or not found" })
    }

    // --- ✅ Use Medusa's orderService to create order ---
    const orderService = req.scope.resolve("orderService")
    const cartService = req.scope.resolve("cartService")

    // (Optional) ensure cart has address, region, etc.
    await cartService.update(cart.id, { shipping_address_id: address_id })

    // Create order from cart
    const order = await orderService.createFromCart(cart.id)

    // Optionally clear the cart after order creation
    await em.nativeDelete(CartItem, { cart: cart.id })

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    })
  } catch (err) {
    console.error("Checkout error:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}
