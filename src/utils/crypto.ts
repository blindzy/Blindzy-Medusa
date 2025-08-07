import crypto from "crypto"

const algorithm = "aes-256-cbc"
const secretKey = Buffer.from(process.env.CRYPTO_SECRET || "default_very_secure_secret_key_32b")

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16) // Generate new IV for each encryption
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString("hex") + ":" + encrypted.toString("hex")
}

export function decrypt(text: string): string {
  if (!text?.includes(":")) return ""

  const [ivHex, encryptedHex] = text.split(":")
  if (!ivHex || !encryptedHex) return ""

  const iv = Buffer.from(ivHex, "hex")
  const encryptedText = Buffer.from(encryptedHex, "hex")

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
