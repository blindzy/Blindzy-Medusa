import {
  createStep,
  createWorkflow,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { sendNotificationStep } from "./steps/send-notification"
import { StepResponse } from "@medusajs/framework/workflows-sdk"

const logOrderStep = createStep(
  "log-order-step",
  async ({ order, fulfillment }: { order: any; fulfillment: any }, { container }) => {
    const logger = container.resolve("logger")
    logger.info(`Order data: ${JSON.stringify(order, null, 2)}`)
    logger.info(`Fulfillment data: ${JSON.stringify(fulfillment, null, 2)}`)
    logger.info(`Order email: ${order?.email}`)
    return new StepResponse(null)
  }
)

type WorkflowInput = {
  order_id: string
  fulfillment_id: string
}

export const sendFulfillmentEmailWorkflow = createWorkflow(
  "send-fulfillment-email",
  ({ order_id, fulfillment_id }: WorkflowInput) => {
    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "currency_code",
        "total",
        "subtotal",
        "shipping_total",
        "tax_total",
        "discount_total",
        "items.*",
        "items.variant.*",            // 👈 for variant title/sku
        "items.variant.product.*",    // 👈 for product title/thumbnail
        "customer.*",
        "shipping_address.*",
        "billing_address.*",
      ],
      filters: { id: order_id },
      options: { throwIfKeyNotFound: true },
    })

    const { data: fulfillments } = useQueryGraphStep({
      entity: "fulfillment",
      fields: ["id", "tracking_numbers"],
      filters: { id: fulfillment_id },
    }).config({ name: "get-fulfillment-details" })

    logOrderStep({ order: orders[0], fulfillment: fulfillments[0] })

    const notification = when(
      { orders },
      (data) => !!data.orders[0]?.email
    ).then(() => {
      return sendNotificationStep([
        {
          to: orders[0].email!,
          channel: "email",
          template: "fulfillment-created",
          data: {
            order: orders[0],
            fulfillment: fulfillments[0],
          },
        },
      ])
    })

    return new WorkflowResponse({ notification })
  }
)