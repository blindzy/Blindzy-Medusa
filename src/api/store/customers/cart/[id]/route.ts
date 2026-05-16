import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../../utils/orm"
import { CartItem } from "../../../../../entities/cart-item.entity"

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  const cartItemId = req.params.id
  const { quantity, customizations } = req.body as any

  const orm = await initORM()
  const em = orm.em.fork()

  const cartItem = await em.findOne(CartItem, { id: cartItemId })

  if (!cartItem) {
    return res.status(404).json({ message: "Cart item not found" })
  }

  if (quantity !== undefined) {
    cartItem.quantity = quantity
  }

  if (customizations !== undefined) {
    cartItem.customizations = customizations
  }

  cartItem.updated_at = new Date()

  await em.persistAndFlush(cartItem)

  return res.status(200).json({
    message: "Cart item updated",
    item: {
      id: cartItem.id,
      quantity: cartItem.quantity,
      customizations: cartItem.customizations,
      updated_at: cartItem.updated_at,
    },
  })
}
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const cartItemId = req.params.id
  
    const orm = await initORM()
    const em = orm.em.fork()
  
    const cartItem = await em.findOne(CartItem, { id: cartItemId })
  
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" })
    }
  
    await em.removeAndFlush(cartItem)
  
    return res.status(200).json({
      message: "Cart item removed successfully",
      item_id: cartItemId,
    })
  }