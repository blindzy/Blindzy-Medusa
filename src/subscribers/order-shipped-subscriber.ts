import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { sendShippedEmailWorkflow } from "../workflows/send-shipped-email"

export default async function orderShippedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; no_notification?: boolean }>) {
  const logger = container.resolve("logger")

  if (data.no_notification) return

  try {
    await sendShippedEmailWorkflow(container).run({
      input: { fulfillment_id: data.id },
    })
  } catch (error: any) {
    logger.error("Failed to send shipped email", error)
  }
}

export const config: SubscriberConfig = {
  event: "shipment.created",
}