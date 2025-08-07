import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Customer } from "../../../../entities/customer.entity"

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id, ...updates } = req.body

    if (!id) {
      return res.status(400).json({ error: "Customer ID is required." })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    const customer = await em.findOne(Customer, { id })

    if (!customer) {
      return res.status(404).json({ error: "Customer not found." })
    }

    const allowedFields = [
      "first_name",
      "last_name",
      "email",
      "username",
      "phone",
      "company_name",
      "pfp_url",
    ]

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        (customer as any)[key] = updates[key]
      }
    }

    await em.persistAndFlush(customer)

    return res.status(200).json({
      message: "Customer updated successfully.",
      customer: {
        id: customer.id,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        username: customer.username,
        company_name: customer.company_name,
        pfp_url: customer.pfp_url,
      },
    })
  } catch (err) {
    console.error("Error updating customer:", err)
    return res.status(500).json({ error: "Failed to update customer." })
  }
}
