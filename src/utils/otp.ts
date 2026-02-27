import { createClient } from "redis"
import crypto from "crypto"

const redisClient = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" })

redisClient.on("error", (err) => console.error("Redis error:", err))

const ensureConnected = async () => {
  if (!redisClient.isOpen) await redisClient.connect()
}

const OTP_TTL = 10 * 60 // 10 minutes in seconds
const OTP_PREFIX = "email_otp:"

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString()
}

export const storeOTP = async (email: string, otp: string): Promise<void> => {
  await ensureConnected()
  const key = `${OTP_PREFIX}${email}`
  await redisClient.set(key, otp, { EX: OTP_TTL })
}

export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  await ensureConnected()
  const key = `${OTP_PREFIX}${email}`
  const stored = await redisClient.get(key)
  if (!stored || stored !== otp) return false
  await redisClient.del(key) // one-time use
  return true
}