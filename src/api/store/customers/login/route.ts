import { Request, Response } from 'express'
import { initORM } from '../../../../utils/orm'
import { Customer } from '../../../../entities/customer.entity'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const POST = async (req: Request, res: Response) => {
  const { email, username, password } = req.body as any

  if (!password || (!email && !username)) {
    return res.status(400).json({ error: 'Missing credentials' })
  }

  try {
    const orm = await initORM()
    const em = orm.em.fork()

    const customer = await em.findOne(Customer, {
      ...(email ? { email } : {}),
      ...(username ? { username } : {}),
    })

    if (!customer) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password, customer.password_hash || '')

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'supersecret'
    const token = jwt.sign(
      {
        id: customer.id,
        email: customer.email,
        username: customer.metadata?.username,
      },
      jwtSecret,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      message: 'Login successful',
      token,
      customer: {
        id: customer.id,
        first_name: customer.metadata?.first_name,
        last_name: customer.metadata?.last_name,
        email: customer.email,
        username: customer.metadata?.username,
        phone: customer.phone,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
