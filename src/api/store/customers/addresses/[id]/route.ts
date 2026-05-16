import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../../utils/orm"
import { CustomerAddress } from "../../../../../entities/customer-address.entity"

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  try {
    const id = req.params.id

    if (!id) {
      return res.status(400).json({ message: "Missing address ID in URL" })
    }

    const {
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
      is_default_billing
    } = req.body as any

    const orm = await initORM()
    const em = orm.em.fork()

    const address = await em.findOne(CustomerAddress, { id })

    if (!address) {
      return res.status(404).json({ message: "Address not found" })
    }

    Object.assign(address, {
      address_name: address_name ?? address.address_name,
      company: company ?? address.company,
      first_name: first_name ?? address.first_name,
      last_name: last_name ?? address.last_name,
      address_1: address_1 ?? address.address_1,
      address_2: address_2 ?? address.address_2,
      city: city ?? address.city,
      country_code: country_code ?? address.country_code,
      province: province ?? address.province,
      postal_code: postal_code ?? address.postal_code,
      phone: phone ?? address.phone,
      house_no: house_no ?? address.house_no,
      street_no: street_no ?? address.street_no,
      house_type: house_type ?? address.house_type,
      is_default_shipping: is_default_shipping ?? address.is_default_shipping,
      is_default_billing: is_default_billing ?? address.is_default_billing,
    })

    await em.persistAndFlush(address)

    return res.status(200).json({
      message: "Address updated successfully",
      address
    })
  } catch (err) {
    console.error("Error updating address:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
    try {
      const { id } = req.params
  
      if (!id) {
        return res.status(400).json({ message: "Missing address ID in URL" })
      }
  
      const orm = await initORM()
      const em = orm.em.fork()
  
      const address = await em.findOne(CustomerAddress, { id })
  
      if (!address) {
        return res.status(404).json({ message: "Address not found" })
      }
  
      await em.removeAndFlush(address)
  
      return res.status(200).json({ message: "Address deleted successfully" })
    } catch (err) {
      console.error("Error deleting address:", err)
      return res.status(500).json({ message: "Internal server error" })
    }
  }