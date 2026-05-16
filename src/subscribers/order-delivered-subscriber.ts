import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendDeliveredEmailWorkflow } from "../workflows/send-delivered-email"

export default async function orderDeliveredHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")

  try {
    await sendDeliveredEmailWorkflow(container).run({
      input: { fulfillment_id: data.id },
    })
  } catch (error: any) {
    logger.error("Failed to send delivered email", error)
  }
}

export const config: SubscriberConfig = {
  event: "delivery.created",
}