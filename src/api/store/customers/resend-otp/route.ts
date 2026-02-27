import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { Customer } from "../../../../entities/customer.entity"
import { initORM } from "../../../../utils/orm"
import { generateOTP, storeOTP } from "../../../../utils/otp"
import { sendOTPEmail } from "../../../../utils/resend-client"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email is required" })
    }

    const orm = await initORM()
    const em = orm.em.fork()
    const customer = await em.findOne(Customer, { email })
    await orm.close()

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" })
    }

    if (customer.metadata?.email_verified) {
      return res.status(400).json({ error: "Email already verified" })
    }

    const otp = generateOTP()
    await storeOTP(email, otp)
    await sendOTPEmail(email, otp)

    return res.status(200).json({ message: "OTP resent successfully" })
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Something went wrong" })
  }
}
