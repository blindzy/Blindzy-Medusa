import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../../utils/orm"

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
        ca.address_1,
        ca.address_2,
        ca.city,
        ca.postal_code,
        ca.province,
        ca.country_code as country
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
    let items
    try {
      items = (typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map(item => ({
        id: `item_${item.product_id}`,
        title: item.customizations?.title || 'Custom Product',
        description: 'Custom Product',
        thumbnail: item.customizations?.thumbnail,
        variant: {
          id: item.product_id,
          title: item.customizations?.title || 'Custom Product',
          product_id: item.product_id,
          product: {
            id: item.product_id,
            title: item.customizations?.title || 'Custom Product',
            thumbnail: item.customizations?.thumbnail,
            handle: item.product_id,
            description: 'Custom Product',
            status: 'published',
            images: item.customizations?.thumbnail ? [item.customizations.thumbnail] : []
          }
        },
        quantity: item.quantity,
        unit_price: item.customizations?.amount || 0,
        subtotal: (item.customizations?.amount || 0) * item.quantity,
        total: (item.customizations?.amount || 0) * item.quantity,
        original_total: (item.customizations?.amount || 0) * item.quantity,
        refundable: 0,
        tax_total: 0,
        tax_lines: [],
        metadata: null
      }))
    } catch (e) {
      console.error("Failed to parse order.items JSON for preview:", e)
      console.error("Problematic order.items value for preview:", order.items)
      return res.status(500).json({ message: "Failed to parse order items for preview" })
    }

    const formattedOrder = {
      id: order.id,
      display_id: parseInt(order.id.split('-')[0], 16),
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
      canceled_at: null,
      email: order.customer_email,
      customer: {
        id: order.customer_id,
        email: order.customer_email,
        first_name: order.first_name,
        last_name: order.last_name,
        has_account: true,
        phone: null,
        metadata: null
      },
      shipping_address: {
        first_name: order.first_name,
        last_name: order.last_name,
        company: null,
        address_1: order.address_1,
        address_2: order.address_2,
        city: order.city,
        postal_code: order.postal_code,
        province: order.province,
        country_code: order.country,
        phone: null,
        metadata: null
      },
      billing_address: {
        first_name: order.first_name,
        last_name: order.last_name,
        company: null,
        address_1: order.address_1,
        address_2: order.address_2,
        city: order.city,
        postal_code: order.postal_code,
        province: order.province,
        country_code: order.country,
        phone: null,
        metadata: null
      },
      items,
      total: order.total_price || 0,
      subtotal: order.total_price || 0,
      paid_total: order.total_price || 0,
      refunded_total: 0,
      refundable_amount: 0,
      gift_card_total: 0,
      gift_card_tax_total: 0,
      tax_total: 0,
      shipping_total: 0,
      discount_total: 0,
      currency_code: "aud",
      payment_status: "captured",
      fulfillment_status: order.status === 'completed' ? 'fulfilled' : 'not_fulfilled',
      region: {
        id: "reg_oceania",
        name: "Oceania",
        currency_code: "aud",
        tax_rate: 0,
        automatic_taxes: false,
        tax_code: null
      },
      payments: [{
        id: `pay_${order.id}`,
        amount: order.total_price || 0,
        currency_code: "aud",
        provider_id: "stripe",
        captured_at: order.created_at,
        status: "captured"
      }],
      fulfillments: [],
      returns: [],
      claims: [],
      refunds: [],
      shipping_methods: [],
      discounts: [],
      gift_cards: [],
      gift_card_transactions: [],
      metadata: null
    }

    return res.status(200).json({
      order: formattedOrder
    })
  } catch (err) {
    console.error("Error fetching admin order preview:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}