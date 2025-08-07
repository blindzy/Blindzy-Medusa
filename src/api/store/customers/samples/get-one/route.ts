import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../../utils/orm"
import { Sample } from "../../../../../entities/sample.entity"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.query

  const orm = await initORM()
  const em = orm.em.fork()

  const sample = await em.findOne(Sample, { id })

  if (!sample) {
    return res.status(404).json({ message: "Sample not found" })
  }

  return res.status(200).json({ sample })
}
