import {
  createWorkflow,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { sendNotificationStep } from "./steps/send-notification"

type WorkflowInput = {
  fulfillment_id: string
}

export const sendShippedEmailWorkflow = createWorkflow(
  "send-shipped-email",
  ({ fulfillment_id }: WorkflowInput) => {
    const { data: orderFulfillments } = useQueryGraphStep({
      entity: "order_fulfillment",
      fields: ["order_id"],
      filters: { fulfillment_id },
      options: { throwIfKeyNotFound: true },
    })

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
        "items.variant.*",
        "items.variant.product.*",
        "customer.*",
        "shipping_address.*",
        "billing_address.*",
      ],
      filters: { id: orderFulfillments[0].order_id },
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-order-details" })

    const { data: fulfillments } = useQueryGraphStep({
      entity: "fulfillment",
      fields: [
        "id",
        "tracking_numbers",
        "shipped_at",        // 👈 useful for shipped email
        "delivered_at",
        "items.*",           // 👈 fulfillment line items
        "labels.*",          // 👈 shipping labels if any
      ],
      filters: { id: fulfillment_id },
    }).config({ name: "get-fulfillment-details" })

    const notification = when(
      { orders },
      (data) => !!data.orders[0]?.email
    ).then(() => {
      return sendNotificationStep([
        {
          to: orders[0].email!,
          channel: "email",
          template: "order-shipped",
          data: { order: orders[0], fulfillment: fulfillments[0] },
        },
      ])
    })

    return new WorkflowResponse({ notification })
  }
)