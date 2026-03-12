import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

console.log("Resend API Key:", process.env.RESEND_API_KEY, process.env.EMAIL_FROM)

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {

    console.log("Sending OTP to:", email)

  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@blindzy.com",
    to: email,
    subject: "Verify your email",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2>Email Verification</h2>
        <p>Use the OTP below to verify your email. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 0;">
          ${otp}
        </div>
        <p style="color: #888;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  })

  console.log("Resend data:", data)   // 👈 success response
  console.log("Resend error:", error) // 👈 will show exact issue

  if (error) {
    throw new Error(`Failed to send email: ${JSON.stringify(error)}`)
  }
}