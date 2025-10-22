import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { initORM } from "../../../../utils/orm"
import { Cart } from "../../../../entities/cart.entity"
import { CartItem } from "../../../../entities/cart-item.entity"
import { CustomerAddress } from "../../../../entities/customer-address.entity"
import { OrderModuleService } from "@medusajs/order"

export const config = {
  api: {
    bodyParser: true,
  },
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { customer_id, address_id } = req.body ?? {}

    if (!customer_id || !address_id) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const orm = await initORM()
    const em = orm.em.fork()

    const cart = await em.findOne(
      Cart,
      { customer: customer_id },
      { populate: ["items"] }
    )

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found" })
    }

    const address = await em.findOne(CustomerAddress, { id: address_id });

    if (!address) {
      return res.status(400).json({ message: "Address not found" });
    }

    const orderModuleService: OrderModuleService = req.scope.resolve("orderModuleService")

    const items = cart.items.map(item => {
      return {
        title: item.customizations?.title || 'Custom Product',
        quantity: item.quantity,
        unit_price: item.customizations?.price || 0,
        // variant_id: "dummy_variant_id", // We might need a dummy variant
        metadata: {
          custom_product_id: item.product_id,
          customizations: item.customizations
        }
      }
    });

    const orderData = {
      region_id: "reg_oceania", // Hardcoded for now
      customer_id: customer_id,
      shipping_address: {
        first_name: address.first_name,
        last_name: address.last_name,
        address_1: address.address_1,
        address_2: address.address_2,
        city: address.city,
        province: address.province,
        postal_code: address.postal_code,
        country_code: address.country_code,
      },
      billing_address: {
        first_name: address.first_name,
        last_name: address.last_name,
        address_1: address.address_1,
        address_2: address.address_2,
        city: address.city,
        province: address.province,
        postal_code: address.postal_code,
        country_code: address.country_code,
      },
      items: items,
      currency_code: "aud", // Hardcoded for now
    }

    const order = await orderModuleService.create(orderData)

    // Clear cart items
    await em.nativeDelete(CartItem, { cart: cart.id })

    return res.status(201).json({
      message: "Order placed successfully",
      order: order,
    })
  } catch (err) {
    console.error("Checkout error:", err)
    return res.status(500).json({ message: "Internal server error" })
  }
}