import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendFulfillmentEmailWorkflow } from "../workflows/send-fulfillment-email"

export default async function fulfillmentCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ order_id: string; fulfillment_id: string; no_notification: boolean }>) {
  const logger = container.resolve("logger")

  if (data.no_notification) {
    logger.info(`Skipping fulfillment email for order ${data.order_id} (no_notification=true)`)
    return
  }

  logger.info(`Fulfillment ${data.fulfillment_id} created for order ${data.order_id}. Sending email...`)

  try {
    await sendFulfillmentEmailWorkflow(container).run({
      input: {
        order_id: data.order_id,
        fulfillment_id: data.fulfillment_id,
      },
    })
  } catch (error: any) {
    logger.error("Failed to send fulfillment email", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.fulfillment_created",
}