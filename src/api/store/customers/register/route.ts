import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { generateOTP, storeOTP } from "../../../../utils/otp"
import { hashSync } from "bcryptjs"
import { Customer } from '../../../../entities/customer.entity'
import { initORM } from "../../../../utils/orm"
import { sendOTPEmail } from "../../../../utils/resend-client"
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            phone,
        } = req.body
        
        const orm = await initORM()
        const em = orm.em.fork()
        
        const existing = await em.findOne(Customer, { email: email })
        if (existing) {
            return res.status(400).json({ error: "Email already in use" })
        }


        const customer = em.create(Customer, {
            first_name,
            last_name,
            email,
            phone: phone,
            password_hash: hashSync(password, 10),
            metadata: { phone, email_verified: false },
            created_at: new Date(),
            updated_at: new Date(),
        })

        await em.persistAndFlush(customer)
        await orm.close()

        const otp = generateOTP();
        await storeOTP(email, otp)
        await sendOTPEmail(email, otp)


        return res.status(201).json({
            message: "Customer created successfully, Please verify your email",
            customer,
        })
    } catch (error: any) {
        console.error("Customer creation error:", error)
        return res.status(500).json({
            error: error.message || "Something went wrong"
        })
    }
}
