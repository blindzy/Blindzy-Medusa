import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { name, email, phone, enquiry, number, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Missing required fields: name, email, and message",
      })
    }

    const subject = `📩 New Contact Message from ${name}`
    const text = `
Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}
Enquiry Type: ${enquiry || "N/A"}
Number: ${number || "N/A"}

Message:
${message}
    `.trim()

    const response = await resend.emails.send({
      from: "onboarding@blindzy.com",  // Required for test accounts
      to: "admin@blindzy.com",  // Must be your email (verified)
      reply_to: email,
      subject,
      text,
    })

    if (response.error) {
      console.error("Resend error:", response.error)
      return res.status(500).json({ message: "Failed to send email" })
    }

    return res.status(200).json({ message: "Message sent successfully" })
  } catch (err) {
    console.error("Error sending contact email:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}
