import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../utils/orm"

export const config = {
  api: {
    bodyParser: true,
  },
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const orm = await initORM()
    const em = orm.em.fork()

    // Query all orders with customer and address information
    const result = await em.getConnection().execute(`
      SELECT 
        uo.*,
        c.email as customer_email,
        c.first_name,
        c.last_name,
        ca.address_1,
        ca.address_2,
        ca.city,
        ca.postal_code,
        ca.province,
        ca.country_code as country
      FROM user_orders uo
      LEFT JOIN customer c ON uo.customer_id = c.id
      LEFT JOIN customer_address ca ON uo.address_id = ca.id
      ORDER BY uo.created_at DESC
    `)

    // Transform the data to match Medusa's order format
    const orders = result.map(order => ({
      id: order.id,
      display_id: order.id.split('-')[0], // Use first part of UUID as display ID
      status: order.status,
      fulfillment_status: order.status === 'completed' ? 'fulfilled' : 'not_fulfilled',
      payment_status: 'paid', // Since payment is handled by Stripe
      created_at: order.created_at,
      updated_at: order.updated_at,
      email: order.customer_email,
      customer: {
        id: order.customer_id,
        email: order.customer_email,
        first_name: order.first_name,
        last_name: order.last_name,
        has_account: true
      },
      shipping_address: {
        first_name: order.first_name,
        last_name: order.last_name,
        address_1: order.address_1,
        address_2: order.address_2,
        city: order.city,
        postal_code: order.postal_code,
        province: order.province,
        country_code: order.country
      },
      items: (typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map(item => ({
        ...item,
        title: item.customizations?.title || 'Custom Product',
        variant: {
          title: item.customizations?.title || 'Custom Product',
        },
        quantity: item.quantity,
        unit_price: item.customizations?.price || 0,
        thumbnail: item.customizations?.thumbnail
      })),
      total: order.total_price,
      subtotal: order.total_price,
      tax_total: 0,
      shipping_total: 0,
      discount_total: 0,
      currency_code: "aud" // Assuming AUD as default currency
    }))

    // Format the response to match Medusa's order list format
    return res.status(200).json({
      orders,
      count: orders.length,
      limit: 50,
      offset: 0,
      fields: [
        "id",
        "status",
        "created_at",
        "display_id",
        "total",
        "currency_code",
        "customer",
        "shipping_address",
        "items"
      ],
      relations: [
        "customer",
        "shipping_address",
        "items"
      ],
      includes: {
        customer: true,
        shipping_address: true,
        items: true
      }
    })
  } catch (err) {
    console.error("Error fetching admin orders:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}