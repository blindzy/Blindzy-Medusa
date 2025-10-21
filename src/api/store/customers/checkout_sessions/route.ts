import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import Stripe from "stripe";

const stripe = new Stripe("sk_test_51ReVtpEyZ8uIZ3ONiCUsFFskvWMXSfx2XeCRyZ2nW5kZxOJZCTTqIVZC3H7UsZhJeg6Qf3r3TIuZCDZcvRwHb9PN00hiA5k3fz");

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { amount, email, phone, name, address } = req.body as any;

    // Validate the amount
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: 'aud',
      payment_method_types: ['card', 'link'],
      receipt_email: email,
      metadata: {
        phone: phone,
        name: name,
        address: JSON.stringify(address),
      },
    });

    // Return the client secret in the response
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
