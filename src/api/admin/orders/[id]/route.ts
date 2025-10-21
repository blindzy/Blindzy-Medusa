import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"

export const config = {
  api: {
    bodyParser: true,
  },
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const orderId = req.params.id

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    // Query specific order with customer and address information
    const result = await em.getConnection().execute(`
      SELECT 
        uo.*,
        c.email as customer_email,
        c.first_name,
        c.last_name,
        ca.address_line_1,
        ca.address_line_2,
        ca.city,
        ca.postal_code,
        ca.state,
        ca.country
      FROM user_orders uo
      LEFT JOIN customer c ON uo.customer_id = c.id
      LEFT JOIN customer_address ca ON uo.address_id = ca.id
      WHERE uo.id = ?
    `, [orderId])

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Order not found" })
    }

    const order = result[0]

    // Transform the order to match Medusa's format
    const formattedOrder = {
      id: order.id,
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
      customer: {
        id: order.customer_id,
        email: order.customer_email,
        first_name: order.first_name,
        last_name: order.last_name,
      },
      shipping_address: {
        address_1: order.address_line_1,
        address_2: order.address_line_2,
        city: order.city,
        postal_code: order.postal_code,
        province: order.state,
        country_code: order.country,
      },
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
      total: order.total_price,
      currency_code: "aud", // Assuming AUD as default currency
      payment_status: "paid", // Since Stripe payment is done before order creation
      fulfillment_status: order.status === 'completed' ? 'fulfilled' : 'not_fulfilled'
    }

    return res.status(200).json({
      order: formattedOrder
    })
  } catch (err) {
    console.error("Error fetching admin order:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}