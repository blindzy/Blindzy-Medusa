import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import { Logger } from "@medusajs/framework/types"
import { Resend } from "resend"
import { CreateEmailOptions } from "resend"
import {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"

import fulfillmentCreatedEmail from "./emails/fulfillment-created"
import orderShippedEmail from "./emails/order-shipped"
import orderDeliveredEmail from "./emails/order-delivered"

type TemplateFunction = (props: any) => string;

const templates: Record<string, TemplateFunction> = {
  "fulfillment-created": fulfillmentCreatedEmail,
  "order-shipped": orderShippedEmail,
  "order-delivered": orderDeliveredEmail
  // Add more templates here later
}

type ResendOptions = {
  api_key: string
  from: string
  html_templates?: Record<string, { subject?: string; content: string }>
}

enum Templates {
  FULFILLMENT_CREATED = "fulfillment-created",
  ORDER_SHIPPED = "order-shipped",
  ORDER_DELIVERED = "order-delivered",
}


class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "notification-resend"

  private resendClient: Resend
  private options: ResendOptions
  private logger: Logger

  constructor({ logger }: { logger: Logger }, options: ResendOptions) {
    super()
    this.resendClient = new Resend(options.api_key)
    this.options = options
    this.logger = logger
  }

  static validateOptions(options: Record<any, any>) {
    if (!options.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Option `api_key` is required"
      )
    }
    if (!options.from) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Option `from` is required"
      )
    }
  }

  private getTemplate(template: Templates) {
    if (this.options.html_templates?.[template]) {
      return this.options.html_templates[template].content
    }
    const allowed = Object.keys(templates)
    if (!allowed.includes(template)) return null
    return templates[template]
  }

  private getTemplateSubject(template: Templates) {
    if (this.options.html_templates?.[template]?.subject) {
      return this.options.html_templates[template].subject
    }
    switch (template) {
      case Templates.FULFILLMENT_CREATED:
        return "Your Order Has Been Fulfilled 🎉"
      case Templates.ORDER_SHIPPED:
        return "Your Order Is On Its Way 🚚"
      case Templates.ORDER_DELIVERED:
        return "Your Order Has Been Delivered ✅"
      default:
        return "New Notification"
    }
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const template = this.getTemplate(notification.template as Templates)

    if (!template) {
      this.logger.error(
        `Template ${notification.template} not found. Valid: ${Object.values(Templates)}`
      )
      return {}
    }

    const subject = this.getTemplateSubject(notification.template as Templates)

    // Generate HTML — template is either a raw string or a function returning a string
    const html =
      typeof template === "function"
        ? template(notification.data)
        : template

    const { data, error } = await this.resendClient.emails.send({
      from: this.options.from,
      to: [notification.to],
      subject,
      html,
    })

    if (error || !data) {
      this.logger.error("Failed to send email via Resend", error)
      return {}
    }

    return { id: data.id }
  }
}

export default ResendNotificationProviderService