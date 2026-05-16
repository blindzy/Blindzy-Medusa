import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { initORM } from "../../../../utils/orm";
import { Customer } from "../../../../entities/customer.entity";
import bcrypt from "bcryptjs";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, newPassword } = req.body as any;

  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required." });
  }

  try {
    const orm = await initORM();
    const em = orm.em.fork();

    const customer = await em.findOne(Customer, { email });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    // Hash the new password with bcrypt
    customer.password_hash = bcrypt.hashSync(newPassword, 10);

    await em.persistAndFlush(customer);

    return res.status(200).json({ success: true, message: "Password reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ error: "Failed to reset password." });
  }
}
