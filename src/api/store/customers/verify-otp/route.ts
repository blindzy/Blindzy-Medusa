import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { initORM } from "../../../../utils/orm";
import { Otp } from "../../../../entities/otp.entity";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required." });
  }

  try {
    const orm = await initORM();
    const em = orm.em.fork();

    // Find OTP for the given email
    const record = await em.findOne(Otp, { email, otp });

    if (!record) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    // Optional: check if OTP is expired (5 mins validity)
    const expiry = new Date(record.created_at);
    expiry.setMinutes(expiry.getMinutes() + 5);

    if (new Date() > expiry) {
      return res.status(400).json({ error: "OTP expired." });
    }

    return res.status(200).json({ success: true, message: "OTP verified." });
  } catch (err) {
    console.error("OTP verification error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
