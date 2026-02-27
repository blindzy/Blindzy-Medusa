import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { cancelOrderWorkflow } from "@medusajs/medusa/core-flows"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        error: "Order id is required",
      })
    }

    const { result } = await cancelOrderWorkflow(req.scope)
      .run({
        input: {
          order_id: id,
        },
      })

    res.status(200).json(result)
  } catch (error: any) {
    res.status(500).json({
      error: error.message || "Failed to cancel order",
    })
  }
}