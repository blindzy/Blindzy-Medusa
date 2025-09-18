import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { v4 as uuidv4 } from "uuid"
import { Card } from "../../../../entities/card.entity"
import { Customer } from "../../../../entities/customer.entity"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const {
      email,
      card_type,
      card_number,
      card_name,
      expiry_date,
      security_code,
    } = req.body

    if (
      !email ||
      !card_type ||
      !card_number ||
      !card_name ||
      !expiry_date ||
      !security_code
    ) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    const customer = await em.findOne(Customer, { email })

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    const newCard = em.create(Card, {
      id: uuidv4(),
      customer,
      card_type,
      card_number,
      card_name,
      expiry_date,
      security_code,
    })

    await em.persistAndFlush(newCard)

    return res.status(201).json({
      message: "Card added successfully",
      card_id: newCard.id,
    })
  } catch (err) {
    console.error("Error adding card:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { email } = req.query

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    const customer = await em.findOne(Customer, { email })

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" })
    }

    const cards = await em.find(Card, { customer })

    const decryptedCards = cards.map((card) => ({
        id: card.id,
        card_type: card.card_type,
        card_name: card.card_name,
        card_number: card.getDecryptedCardNumber(),
        expiry_date: card.getDecryptedExpiryDate(),
        security_code: card.getDecryptedSecurityCode(),
      }))
      

    return res.status(200).json({ cards: decryptedCards })
  } catch (err) {
    console.error("Error fetching cards:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}
