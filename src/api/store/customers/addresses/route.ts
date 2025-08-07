import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Customer } from "../../../../entities/customer.entity"
import { CustomerAddress } from "../../../../entities/customer-address.entity"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const {
      email,
      address_name,
      company,
      first_name,
      last_name,
      address_1,
      address_2,
      city,
      country_code,
      province,
      postal_code,
      phone,
      house_no,
      street_no,
      house_type,
      is_default_shipping = false,
      is_default_billing = false
    } = req.body

    if (!email || !first_name || !last_name || !address_1 || !city || !country_code || !postal_code) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    const customer = await em.findOne(Customer, { email })

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    const newAddress = em.create(CustomerAddress, {
      id: uuidv4(),
      customer_id: customer.id,
      address_name,
      company,
      first_name,
      last_name,
      address_1,
      address_2,
      city,
      country_code,
      province,
      postal_code,
      phone,
      house_no,
      street_no,
      house_type,
      is_default_shipping,
      is_default_billing,
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
    const { email, id } = req.query

    const orm = await initORM()
    const em = orm.em.fork()

    if (id) {
      // ✅ Single Address by ID
      const address = await em.findOne(CustomerAddress, { id: id as string })

      if (!address) {
        return res.status(404).json({ message: "Address not found" })
      }

      return res.status(200).json({
        message: "Address fetched successfully",
        address
      })
    }

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required as query param" })
    }

    const customer = await em.findOne(Customer, { email })

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    const addresses = await em.find(CustomerAddress, { customer_id: customer.id })

    return res.status(200).json({
      message: "Addresses fetched successfully",
      addresses
    })
  } catch (err) {
    console.error("Error fetching address:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}
