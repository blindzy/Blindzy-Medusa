import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import multer from "multer"
import { initORM } from "../../../../utils/orm"
import { Customer } from "../../../../entities/customer.entity"

const upload = multer({ dest: "uploads/" }) // stores files temporarily

export const config = {
  api: {
    bodyParser: false, // required to use multer
  },
}

// Use a wrapper to handle multipart form-data
export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  upload.single("pfp_url")(req as any, res as any, async (err: any) => {
    if (err) {
      return res.status(400).json({ error: "Error processing file upload." })
    }

    try {
      const { email } = req.body as { email?: string }
      const pfpFile = (req as any).file
      const pfpPath = pfpFile?.path




      if (!email || !pfpPath) {
        return res.status(400).json({ message: "Missing email or pfp_url" })
      }

      const orm = await initORM()
      const em = orm.em.fork()

      const customer = await em.findOne(Customer, { email })
      if (!customer) {
        return res.status(404).json({ error: "Customer not found." })
      }

      customer.pfp_url = pfpPath

      await em.persistAndFlush(customer)

      return res.status(200).json({
        message: "Profile picture updated successfully.",
        customer: {
          email: customer.email,
          pfp_url: customer.pfp_url,
        },
      })
    } catch (e) {
      console.error("Error updating profile picture:", e)
      return res.status(500).json({ error: "Something went wrong." })
    }
  })
}
