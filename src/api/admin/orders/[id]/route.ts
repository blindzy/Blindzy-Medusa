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
    let itemsArray
    try {
      itemsArray = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    } catch (e) {
      console.error("Failed to parse order.items JSON:", e)
      console.error("Problematic order.items value:", order.items)
      return res.status(500).json({ message: "Failed to parse order items" })
    }
    const totalPrice = order.total_price || 0
    
    const formattedOrder = {
      id: order.id,
      display_id: parseInt(order.id.split('-')[0], 16),
      status: order.status,
      fulfillment_status: order.status === 'completed' ? 'fulfilled' : 'not_fulfilled',
      payment_status: 'captured',
      created_at: order.created_at,
      updated_at: order.updated_at,
      canceled_at: null,
      draft_order_id: null,
      cart_id: null,
      customer_id: order.customer_id,
      email: order.customer_email,
      sales_channel_id: "default",
      sales_channel: {
        id: "default",
        name: "Default Sales Channel",
        description: "Default sales channel",
        is_disabled: false,
        created_at: order.created_at,
        updated_at: order.updated_at,
        deleted_at: null
      },
      currency_code: "aud",
      tax_rate: 0,
      cart: null,
      draft_order: null,
      order_change: null,
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
        id: order.address_id,
        customer_id: order.customer_id,
        company: null,
        first_name: order.first_name,
        last_name: order.last_name,
        address_1: order.address_1,
        address_2: order.address_2,
        city: order.city,
        country_code: order.country,
        province: order.province,
        postal_code: order.postal_code,
        phone: null,
        created_at: order.created_at,
        updated_at: order.updated_at,
        deleted_at: null,
        metadata: null
      },
      billing_address: {
        id: order.address_id,
        customer_id: order.customer_id,
        company: null,
        first_name: order.first_name,
        last_name: order.last_name,
        address_1: order.address_1,
        address_2: order.address_2,
        city: order.city,
        country_code: order.country,
        province: order.province,
        postal_code: order.postal_code,
        phone: null,
        created_at: order.created_at,
        updated_at: order.updated_at,
        deleted_at: null,
        metadata: null
      },
      items: (typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map(item => ({
        id: `item_${item.product_id}`,
        created_at: order.created_at,
        updated_at: order.updated_at,
        cart_id: null,
        order_id: order.id,
        swap_id: null,
        claim_order_id: null,
        title: item.customizations?.title || 'Custom Product',
        description: 'Custom Product',
        thumbnail: item.customizations?.thumbnail,
        is_return: false,
        is_giftcard: false,
        should_merge: true,
        allow_discounts: true,
        has_shipping: false,
        unit_price: item.customizations?.amount || 0,
        variant: {
          id: item.product_id,
          title: item.customizations?.title || 'Custom Product',
          product_id: item.product_id,
          created_at: order.created_at,
          updated_at: order.updated_at,
          deleted_at: null,
          metadata: null,
          variant_rank: 0,
          manage_inventory: false,
          inventory_quantity: 0,
          options: [],
          product: {
            id: item.product_id,
            title: item.customizations?.title || 'Custom Product',
            subtitle: null,
            description: 'Custom Product',
            handle: item.product_id,
            is_giftcard: false,
            thumbnail: item.customizations?.thumbnail,
            profile_id: null,
            collection_id: null,
            type_id: null,
            weight: null,
            length: null,
            height: null,
            width: null,
            hs_code: null,
            origin_country: null,
            mid_code: null,
            material: null,
            created_at: order.created_at,
            updated_at: order.updated_at,
            deleted_at: null,
            metadata: null,
            status: 'published'
          }
        },
        quantity: item.quantity,
        fulfilled_quantity: item.quantity,
        shipped_quantity: null,
        returned_quantity: null,
        metadata: null,
        tax_lines: [],
        adjustments: [],
        original_total: (item.customizations?.amount || 0) * item.quantity,
        subtotal: (item.customizations?.amount || 0) * item.quantity,
        total: (item.customizations?.amount || 0) * item.quantity,
        raw_discount_total: 0,
        discount_total: 0,
        original_tax_total: 0,
        tax_total: 0,
        refundable: 0
      })),
      total: totalPrice,
      subtotal: totalPrice,
      paid_total: totalPrice,
      refunded_total: 0,
      refundable_amount: 0,
      gift_card_total: 0,
      gift_card_tax_total: 0,
      tax_total: 0,
      raw_discount_total: 0,
      shipping_tax_total: 0,
      raw_shipping_tax_total: 0,
      raw_total: totalPrice,
      credit_line_total: 0,
      item_total: totalPrice,
      shipping_subtotal: 0,
      original_total: totalPrice,
      discount_subtotal: 0,
      refundable_total: 0,
      region: {
        id: "reg_oceania",
        name: "Oceania",
        currency_code: "aud",
        tax_rate: 0,
        tax_code: null,
        automatic_taxes: false,
        created_at: order.created_at,
        updated_at: order.updated_at,
        deleted_at: null,
        metadata: null,
        gift_cards_taxable: false,
        countries: [
          {
            id: 1,
            iso_2: "AU",
            iso_3: "AUS",
            num_code: 36,
            name: "Australia",
            display_name: "Australia",
            region_id: "reg_oceania"
          }
        ]
      },
      payment_collections: [{
        id: `paycol_${order.id}`,
        created_at: order.created_at,
        updated_at: order.updated_at,
        deleted_at: null,
        type: "order_edit",
        status: "authorized",
        description: null,
        amount: totalPrice,
        authorized_amount: totalPrice,
        refunded_amount: 0,
        currency_code: "aud",
        metadata: null,
        region_id: "reg_oceania",
        payments: [{
          id: `pay_${order.id}`,
          created_at: order.created_at,
          updated_at: order.updated_at,
          cart_id: null,
          order_id: order.id,
          swap_id: null,
          amount: totalPrice,
          currency_code: "aud",
          amount_refunded: 0,
          provider_id: "stripe",
          data: {},
          captured_at: order.created_at,
          canceled_at: null,
          metadata: null,
          refunds: []
        }]
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
    console.error("Error fetching admin order:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}