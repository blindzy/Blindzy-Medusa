import { OrderDTO } from "@medusajs/framework/types"

type Props = {
  order: OrderDTO
  fulfillment?: any
}

const toNumber = (value: any): number => {
  if (value == null) return 0
  if (typeof value === "number") return value
  if (typeof value === "string") return Number(value)

  if (typeof value === "object") {
    if ("numeric" in value) return Number(value.numeric)
    if ("value" in value) return Number(value.value)
  }

  return Number(value) || 0
}

const formatAddress = (addr: any) => {
  if (!addr) return "<em style='color:#9ca3af;'>Not provided</em>"

  const parts = [
    [addr.first_name, addr.last_name].filter(Boolean).join(" "),
    addr.company,
    addr.address_1,
    addr.address_2,
    [addr.city, addr.province, addr.postal_code].filter(Boolean).join(", "),
    addr.country_code?.toUpperCase(),
    addr.phone,
  ].filter(Boolean)

  return parts.map((p) => `<span style="display:block;">${p}</span>`).join("")
}

export const fulfillmentCreatedEmail = ({ order, fulfillment }: Props): string => {
  console.log("order.total:", order.total)
  console.log("order.currency_code:", order.currency_code)

  const currency =
    order.currency_code?.toUpperCase() ??
    (order as any)?.payment_collections?.[0]?.currency_code?.toUpperCase() ??
    ""

  // --- Tracking ---
  const trackingHtml =
    fulfillment?.tracking_numbers?.length > 0
      ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
          <p style="margin:0;font-size:14px;color:#166534;">
            <strong>📦 Tracking Number${fulfillment.tracking_numbers.length > 1 ? "s" : ""}:</strong>
            ${fulfillment.tracking_numbers.join(", ")}
          </p>
        </div>`
      : ""

  // --- Items ---
  const itemsHtml =
    order.items
      ?.map((item) => {
        const unitPrice = toNumber(item.unit_price).toFixed(2)
        const lineTotal = (toNumber(item.unit_price) * toNumber(item.quantity)).toFixed(2)

        const thumbnailSrc = item.thumbnail ?? (item.metadata as any)?.thumbnail ?? null
        const thumbnail = thumbnailSrc
          ? `<img src="${thumbnailSrc}" alt="${item.title}" width="56" height="56"
               style="border-radius:6px;object-fit:cover;border:1px solid #e5e7eb;" />`
          : `<div style="width:56px;height:56px;background:#f3f4f6;border-radius:6px;border:1px solid #e5e7eb;"></div>`

        const productTitle = (item as any).variant?.product?.title ?? item.title

        const variantTitle =
          (item as any).variant?.title ?? item.variant_title ?? null

        const customizations: { title: string; value: string }[] =
          (item.metadata as any)?.customizationData ?? []

        const customHtml =
          customizations.length > 0
            ? `<div style="margin-top:8px;">
                ${customizations
                  .map(
                    (attr) =>
                      `<p style="margin:2px 0;font-size:12px;color:#6b7280;">
                        <strong style="color:#374151;">${attr.title}:</strong> ${attr.value}
                      </p>`
                  )
                  .join("")}
              </div>`
            : ""

        return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid #f3f4f6;vertical-align:top;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="width:64px;padding-right:14px;vertical-align:top;">
                  ${thumbnail}
                </td>

                <td style="vertical-align:top;">
                  <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#111827;">
                    ${productTitle}
                  </p>

                  ${variantTitle
                    ? `<p style="margin:0 0 2px;font-size:13px;color:#6b7280;">
                        ${variantTitle}
                      </p>`
                    : ""}

                  ${customHtml}
                </td>

                <td style="vertical-align:top;text-align:right;white-space:nowrap;">
                  <p style="margin:0 0 2px;font-size:13px;color:#6b7280;">×${item.quantity}</p>
                  <p style="margin:0 0 2px;font-size:13px;color:#6b7280;">@ ${currency} ${unitPrice}</p>
                  <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">
                    ${currency} ${lineTotal}
                  </p>
                </td>

              </tr>
            </table>
          </td>
        </tr>`
      })
      .join("") ?? ""

  // --- Totals ---
  const subtotal = toNumber(order.subtotal).toFixed(2)
  const shippingTotal = toNumber(order.shipping_total).toFixed(2)
  const taxTotal = toNumber(order.tax_total).toFixed(2)
  const discountTotal = toNumber(order.discount_total).toFixed(2)

  const total = toNumber(
    order.total ??
      order.summary?.current_order_total ??
      order.summary?.accounting_total ??
      order.original_total
  ).toFixed(2)

  const discountRow =
    toNumber(order.discount_total) > 0
      ? `<tr>
           <td style="padding:6px 0;font-size:14px;color:#059669;">Discount</td>
           <td style="padding:6px 0;font-size:14px;color:#059669;text-align:right;">
             − ${currency} ${discountTotal}
           </td>
         </tr>`
      : ""

  // --- Email date ---
  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Fulfilled — #${order.display_id}</title>
</head>

<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#111827;">

  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f9fafb;padding:32px 16px;">
    <tr>
      <td align="center">

        <table cellpadding="0" cellspacing="0" border="0" width="600"
          style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#111827;padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
                Your order is on its way 🎉
              </p>

              <p style="margin:8px 0 0;font-size:14px;color:#9ca3af;">
                Order <strong style="color:#f9fafb;">#${order.display_id}</strong>
                ${orderDate ? ` &nbsp;·&nbsp; Placed ${orderDate}` : ""}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 0;">

              <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
                Hi${order.email ? ` <strong>${order.email}</strong>` : " there"},<br/>
                Great news — your order has been fulfilled and is heading your way!
              </p>

              ${trackingHtml}

              <!-- Order Items -->
              <h2 style="margin:0 0 12px;font-size:15px;font-weight:700;color:#111827;text-transform:uppercase;letter-spacing:0.5px;">
                Order Items
              </h2>

              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                ${itemsHtml || `<tr><td style="padding:14px 0;font-size:14px;color:#9ca3af;">No items found.</td></tr>`}
              </table>

              <!-- Totals -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:8px;border-top:2px solid #111827;">
                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#6b7280;">Subtotal</td>
                  <td style="padding:6px 0;font-size:14px;color:#6b7280;text-align:right;">
                    ${currency} ${subtotal}
                  </td>
                </tr>

                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#6b7280;">Shipping</td>
                  <td style="padding:6px 0;font-size:14px;color:#6b7280;text-align:right;">
                    ${currency} ${shippingTotal}
                  </td>
                </tr>

                <tr>
                  <td style="padding:6px 0;font-size:14px;color:#6b7280;">Tax</td>
                  <td style="padding:6px 0;font-size:14px;color:#6b7280;text-align:right;">
                    ${currency} ${taxTotal}
                  </td>
                </tr>

                ${discountRow}

                <tr style="border-top:1px solid #e5e7eb;">
                  <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:#111827;">
                    Total
                  </td>
                  <td style="padding:12px 0 0;font-size:16px;font-weight:700;color:#111827;text-align:right;">
                    ${currency} ${total}
                  </td>
                </tr>
              </table>

              <!-- Addresses -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:28px;">
                <tr valign="top">
                  <td width="50%" style="padding-right:12px;">
                    <h3 style="margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;">
                      Shipping Address
                    </h3>

                    <div style="font-size:14px;color:#374151;line-height:1.7;">
                      ${formatAddress(order.shipping_address)}
                    </div>
                  </td>

                  <td width="50%" style="padding-left:12px;">
                    <h3 style="margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280;">
                      Billing Address
                    </h3>

                    <div style="font-size:14px;color:#374151;line-height:1.7;">
                      ${formatAddress(order.billing_address)}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Action Buttons -->
              <div style="margin-top:32px;background:#f9fafb;border-radius:8px;padding:20px;border:1px solid #e5e7eb;">
                <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#111827;">
                  Need to make changes?
                </p>

                <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-right:10px;padding-bottom:8px;">
                      <a href="mailto:blindzy11@gmail.com?subject=Cancel Order %23${order.display_id}"
                         style="display:inline-block;padding:10px 18px;background:#ffffff;border:1px solid #d1d5db;border-radius:6px;font-size:13px;font-weight:600;color:#374151;text-decoration:none;">
                        ❌ Cancel Order
                      </a>
                    </td>

                    <td style="padding-right:10px;padding-bottom:8px;">
                      <a href="mailto:blindzy11@gmail.com?subject=Change Request for Order %23${order.display_id}"
                         style="display:inline-block;padding:10px 18px;background:#ffffff;border:1px solid #d1d5db;border-radius:6px;font-size:13px;font-weight:600;color:#374151;text-decoration:none;">
                        ✏️ Request Change
                      </a>
                    </td>

                    <td style="padding-bottom:8px;">
                      <a href="mailto:blindzy11@gmail.com?subject=Help with Order %23${order.display_id}"
                         style="display:inline-block;padding:10px 18px;background:#111827;border:1px solid #111827;border-radius:6px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;">
                        💬 Contact Support
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:10px 0 0;font-size:12px;color:#9ca3af;">
                  Please note: cancellations and changes may not be possible once your order has shipped.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 32px;text-align:center;border-top:1px solid #f3f4f6;margin-top:32px;">
              <p style="margin:0 0 4px;font-size:13px;color:#9ca3af;">
                Thank you for shopping with us!
              </p>

              <p style="margin:0;font-size:12px;color:#d1d5db;">
                Questions? Email us at
                <a href="mailto:blindzy11@gmail.com" style="color:#6b7280;text-decoration:underline;">
                  blindzy11@gmail.com
                </a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`
}

export default fulfillmentCreatedEmail