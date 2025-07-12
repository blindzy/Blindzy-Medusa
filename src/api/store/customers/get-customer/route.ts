import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { initORM } from "../../../../utils/orm"
import { Customer } from "../../../../entities/customer.entity"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const queryEmail = req.query?.email

    if (!queryEmail || typeof queryEmail !== "string") {
      return res.status(400).json({ error: "Email query parameter is required." })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    const customer = await em.findOne(Customer, { email: queryEmail })

    if (!customer) {
      return res.status(404).json({ error: "Customer not found." })
    }

    const {
      id,
      first_name,
      last_name,
      email,
      phone,
      username,
      created_at,
    } = customer

    return res.status(200).json({
      id,
      first_name,
      last_name,
      email,
      phone,
      username,
      created_at,
    })
  } catch (err) {
    console.error("Error fetching customer:", err)
    return res.status(500).json({ error: "Failed to fetch customer data." })
  }
}
