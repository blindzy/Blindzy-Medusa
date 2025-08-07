import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../../utils/orm"
import { Sample } from "../../../../../entities/sample.entity"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const orm = await initORM()
  const em = orm.em.fork()

  const samples = await em.find(Sample, {})

  return res.status(200).json({ samples })
}
