import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../../utils/orm"
import { Cart } from "../../../../../entities/cart.entity"
import { CartItem } from "../../../../../entities/cart-item.entity"

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const customer_id = req.query.customer_id as string

  if (!customer_id) {
    return res.status(400).json({ message: "Missing customer_id" })
  }

  const orm = await initORM()
  const em = orm.em.fork()

  const cart = await em.findOne(Cart, { customer: customer_id }, { populate: ['items'] })

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" })
  }

  // Remove all cart items
  for (const item of cart.items.getItems()) {
    em.remove(item)
  }

  await em.flush()

  return res.status(200).json({
    message: "All items removed from cart",
    cart_id: cart.id,
  })
}
