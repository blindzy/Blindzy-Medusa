import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { initORM } from "../../../../../utils/orm"
import { Card } from "../../../../../entities/card.entity"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ message: "Card ID is required" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    const card = await em.findOne(Card, { id })

    if (!card) {
      return res.status(404).json({ message: "Card not found" })
    }

    const decryptedCard = {
      id: card.id,
      card_type: card.card_type,
      card_name: card.card_name,
      card_number: card.getDecryptedCardNumber(),
      expiry_date: card.getDecryptedExpiryDate(),
      security_code: card.getDecryptedSecurityCode(),
    }

    return res.status(200).json({ card: decryptedCard })
  } catch (err) {
    console.error("Error fetching card:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
    try {
      const { id } = req.params
      const {
        card_type,
        card_number,
        card_name,
        expiry_date,
        security_code,
      } = req.body
  
      const orm = await initORM()
      const em = orm.em.fork()
  
      const card = await em.findOne(Card, { id }, { populate: ["customer"] })
  
      if (!card) {
        return res.status(404).json({ message: "Card not found" })
      }
  
      // Optional: update fields only if provided
      if (card_type) card.card_type = card_type
      if (card_name) card.card_name = card_name
      if (expiry_date) card.expiry_date = expiry_date
      if (card_number) card.card_number = card_number
      if (security_code) card.security_code = security_code
  
      await em.persistAndFlush(card)
  
      return res.status(200).json({ message: "Card updated successfully" })
    } catch (err) {
      console.error("Error updating card:", err)
      return res.status(500).json({ message: "Internal server error" })
    }
  }

  export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
    try {
      const { id } = req.params
  
      const orm = await initORM()
      const em = orm.em.fork()
  
      const card = await em.findOne(Card, { id })
  
      if (!card) {
        return res.status(404).json({ message: "Card not found" })
      }
  
      await em.removeAndFlush(card)
  
      return res.status(200).json({ message: "Card deleted successfully" })
    } catch (err) {
      console.error("Error deleting card:", err)
      return res.status(500).json({ message: "Internal server error" })
    }
  }