import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { hashSync } from "bcryptjs"
import { Customer } from '../../../../entities/customer.entity'
import { initORM } from "../../../../utils/orm"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const {
            first_name,
            last_name,
            email,
            password,
            phone,
            username
        } = req.body
        
        const orm = await initORM()
        const em = orm.em.fork()
        
        const existing = await em.findOne(Customer, { $or: [{ email: email }, { username: username }] })
        if (existing) {
            throw new Error("Email or username already exists")
        }


        const customer = em.create(Customer, {
            first_name,
            last_name,
            email,
            phone: phone,
            username: username,
            password_hash: hashSync(password, 10),
            metadata: { phone, username },
        })

        await em.persistAndFlush(customer)
        await orm.close()

        return res.status(201).json({
            message: "Customer created successfully",
            customer,
        })
    } catch (error: any) {
        console.error("Customer creation error:", error)
        return res.status(500).json({
            error: error.message || "Something went wrong"
        })
    }
}
