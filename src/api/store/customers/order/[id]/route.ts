import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../../utils/orm"
import { UserOrder } from "../../../../../entities/user-order.entity"
import { Card } from "../../../../../entities/card.entity"
import { CustomerAddress } from "../../../../../entities/customer-address.entity"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: "Order ID is required in URL" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    const order = await em.findOne(UserOrder, { id })

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    const card = await em.findOne(Card, { id: order.card_id })
    const address = await em.findOne(CustomerAddress, { id: order.address_id })

    return res.status(200).json({
      message: "Order fetched successfully",
      order: {
        ...order,
        card,
        address,
      },
    })
  } catch (err) {
    console.error("Error fetching order:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
    try {
      const { id } = req.params
      const updates = req.body as any;
  
      if (!id) {
        return res.status(400).json({ message: "Order ID is required in URL" })
      }
  
      const orm = await initORM()
      const em = orm.em.fork()
  
      const order = await em.findOne(UserOrder, { id })
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" })
      }
  
      // Apply only provided fields
      if (updates.card_id) order.card_id = updates.card_id
      if (updates.address_id) order.address_id = updates.address_id
      if (updates.status) order.status = updates.status
      if (updates.total_price !== undefined) order.total_price = updates.total_price
      if (updates.items) order.items = updates.items
  
      order.updated_at = new Date()
  
      await em.flush()
  
      return res.status(200).json({
        message: "Order updated successfully",
        order
      })
    } catch (err) {
      console.error("Error updating order:", err)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
    try {
      const { id } = req.params
  
      if (!id) {
        return res.status(400).json({ message: "Order ID is required in URL" })
      }
  
      const orm = await initORM()
      const em = orm.em.fork()
  
      const order = await em.findOne(UserOrder, { id })
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" })
      }
  
      await em.remove(order).flush()
  
      return res.status(200).json({
        message: "Order deleted successfully"
      })
    } catch (err) {
      console.error("Error deleting order:", err)
      return res.status(500).json({ message: "Internal server error" })
    }
  }