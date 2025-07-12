import { Request, Response } from "express"
import { Resend } from "resend"
import { v4 as uuidv4 } from "uuid"
import { initORM } from "../../../../utils/orm"
import { Otp } from "../../../../entities/otp.entity" // Make sure this exists!

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request, res: Response) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: "Email is required" })
  }

  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString() // 6-digit code
    const orm = await initORM()
    const em = orm.em.fork()

    // Save OTP to DB
    const otpEntity = em.create(Otp, {
      id: uuidv4(),
      email,
      otp: otpCode,
      created_at: new Date(),
    })
    await em.persistAndFlush(otpEntity)

    // Send email via Resend
    await resend.emails.send({
      from: "Blindzy <no-reply@ezyiah.com.au>",
      to: [email],
      subject: "Password Reset Code",
      html: `<p>Your OTP is: <strong>${otpCode}</strong>. It is valid for 10 minutes.</p>`,
    })

    return res.status(200).json({ message: "OTP sent successfully." })
  } catch (error: any) {
    console.error("Password reset email error:", error)
    return res.status(500).json({ error: "Failed to send OTP." })
  }
}