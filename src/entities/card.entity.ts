import {
    Entity,
    PrimaryKey,
    Property,
    ManyToOne,
    BeforeCreate,
    BeforeUpdate,
  } from '@mikro-orm/core'
  import { Customer } from './customer.entity'
  import crypto from 'crypto'
  
  @Entity({ tableName: 'card' })
  export class Card {
    @PrimaryKey()
    id!: string
  
    @ManyToOne(() => Customer)
    customer!: Customer
  
    @Property()
    card_type!: string
  
    @Property({ persist: false })
    card_number!: string
  
    @Property({ persist: false })
    security_code!: string
  
    @Property({ persist: false })
    expiry_date!: string
  
    @Property()
    encrypted_card_number!: string
  
    @Property()
    encrypted_security_code!: string
  
    @Property()
    encrypted_expiry_date!: string
  
    @Property()
    card_name!: string
  
    private static algorithm = 'aes-256-cbc'
    private static key = crypto
      .createHash('sha256')
      .update(String(process.env.ENCRYPTION_SECRET || 'blindzy_key'))
      .digest()
    private static ivLength = 16
  
    static encrypt(text: string): string {
      const iv = crypto.randomBytes(this.ivLength)
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv)
      let encrypted = cipher.update(text, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      return `${iv.toString('hex')}:${encrypted}`
    }
  
    static decrypt(encrypted: string): string {
      const [ivHex, encryptedHex] = encrypted.split(':')
      if (!ivHex || !encryptedHex) throw new Error('Invalid encrypted format')
      const iv = Buffer.from(ivHex, 'hex')
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv)
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      return decrypted
    }
  
    @BeforeCreate()
    @BeforeUpdate()
    encryptFields() {
      if (this.card_number) {
        this.encrypted_card_number = Card.encrypt(this.card_number)
      }
      if (this.security_code) {
        this.encrypted_security_code = Card.encrypt(this.security_code)
      }
      if (this.expiry_date) {
        this.encrypted_expiry_date = Card.encrypt(this.expiry_date)
      }
    }
  
    getDecryptedCardNumber(): string {
      return Card.decrypt(this.encrypted_card_number)
    }
  
    getDecryptedSecurityCode(): string {
      return Card.decrypt(this.encrypted_security_code)
    }
  
    getDecryptedExpiryDate(): string {
      return Card.decrypt(this.encrypted_expiry_date)
    }
  }
  