import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Customer } from "../../../../entities/customer.entity"
import { CustomerAddress } from "../../../../entities/customer-address.entity"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const {
      customer_id,
      email,
      first_name,
      last_name,
      address_1,
      city,
      country_code,
      postal_code
    } = req.body as any

    if (!customer_id || !email || !address_1 || !city || !country_code || !postal_code) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    const customer = await em.findOne(Customer, { id: customer_id })

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    const newAddress = em.create(CustomerAddress, {
      id: uuidv4(),
      customer_id: customer.id,
      first_name,
      last_name,
      address_1,
      city,
      country_code,
      postal_code
    })

    await em.persistAndFlush(newAddress)

    return res.status(201).json({
      message: "Address created successfully",
      address: newAddress
    })
  } catch (err) {
    console.error("Error creating address:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { email } = req.query

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    const customer = await em.findOne(Customer, { email: email as string })

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    const addresses = await em.find(CustomerAddress, { customer_id: customer.id })

    return res.status(200).json({ addresses })
  } catch (err) {
    console.error("Error fetching addresses:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}