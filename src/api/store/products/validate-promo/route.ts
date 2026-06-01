// src/api/store/products/validate-promo/route.ts

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const { code, product_ids } = req.query

    if (!code || typeof code !== "string") {
        return res.status(400).json({ valid: false, reason: "Missing promo code" })
    }

    const promotionModule = req.scope.resolve(Modules.PROMOTION)

    const promotions = await promotionModule.listPromotions(
        { code },
        { relations: ["application_method", "application_method.target_rules", "application_method.target_rules.values", "rules"] }
    )

    const promo = promotions[0]

    if (!promo) {
        return res.status(200).json({ valid: false, reason: "code_not_found" })
    }

    if (promo.status !== "active") {
        return res.status(200).json({ valid: false, reason: "code_not_active" })
    }

    if (promo.limit !== null && promo.used >= promo.limit) {
        return res.status(200).json({ valid: false, reason: "usage_limit_reached" })
    }

    // Check if customer already used this promo
    const customerId = req.query.customer_id as string

    if (customerId) {
        const usedBy: string[] = (promo as any).metadata?.used_by ?? []
        if (usedBy.includes(customerId)) {
            return res.status(200).json({ valid: false, reason: "already_used" })
        }
    }

    // Check target rules if product_id is provided
    const targetRules = promo.application_method?.target_rules ?? []

    if (targetRules.length > 0) {
        if (!product_ids) {
            return res.status(400).json({ valid: false, reason: "product_ids required for this promo" })
        }

        const incomingIds = (product_ids as string).split(',').map(id => id.trim())

        const productRule = targetRules.find(
            (rule) => rule.attribute === "items.product.id"
        )

        if (productRule) {
            const allowedIds = productRule.values.map((v) => v.value)
            const hasEligible = incomingIds.some(id => allowedIds.includes(id))

            if (!hasEligible) {
                return res.status(200).json({ valid: false, reason: "product_not_eligible" })
            }
        }
    }

    return res.status(200).json({
        valid: true,
        code: promo.code,
        type: promo.application_method?.type,
        value: promo.application_method?.value,
        target_type: promo.application_method?.target_type,
    })
}