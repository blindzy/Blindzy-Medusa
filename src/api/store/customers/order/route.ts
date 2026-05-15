import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Customer } from "../../../../entities/customer.entity"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const {
      customer_id,
      card_id,
      address_id,
      items,
      total_price
    } = req.body

    if (!customer_id || !card_id || !address_id || !Array.isArray(items)) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    // Ensure user_orders table exists
    try {
      const connection = em.getConnection()
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS user_orders (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          customer_id TEXT NOT NULL,
          card_id TEXT NOT NULL,
          address_id TEXT NOT NULL,
          items JSONB NOT NULL,
          total_price NUMERIC,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        );
      `)
      console.log('user_orders table checked/created')
    } catch (error) {
      console.log('Table creation error (might already exist):', error)
    }

    const result = await em.getConnection().execute(`
      INSERT INTO user_orders (
        id,
        customer_id,
        card_id,
        address_id,
        items,
        total_price,
        created_at,
        updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, now(), now()
      ) RETURNING *
    `, [
      uuidv4(),
      customer_id,
      card_id,
      address_id,
      JSON.stringify(items),
      total_price || 0
    ])

    return res.status(201).json({
      message: "Order created successfully",
      order: result[0]
    })

  } catch (err) {
    console.error("Error creating order:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { email } = req.query

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email query param is required" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    const customer = await em.findOne(Customer, { email })

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    const query: any = req.scope.resolve("query")

    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "*",
        "items.*",
        "shipping_address.*",
        "fulfillments.*",
        "fulfillments.items.*",
      ],
      filters: { customer_id: customer.id },
    })

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    })
  } catch (err) {
    console.error("Error fetching orders:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}