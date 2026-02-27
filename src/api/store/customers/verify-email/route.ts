import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Customer } from "../../../../entities/customer.entity"
import { initORM } from "../../../../utils/orm"
import { verifyOTP } from "../../../../utils/otp"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" })
    }

    const isValid = await verifyOTP(email, otp)
    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired OTP" })
    }

    // Mark customer as verified
    const orm = await initORM()
    const em = orm.em.fork()

    const customer = await em.findOne(Customer, { email })
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" })
    }

    customer.metadata = { ...customer.metadata, email_verified: true }
    await em.persistAndFlush(customer)
    await orm.close()

    return res.status(200).json({ message: "Email verified successfully" })
  } catch (error: any) {
    console.error("Email verification error:", error)
    return res.status(500).json({ error: error.message || "Something went wrong" })
  }
}