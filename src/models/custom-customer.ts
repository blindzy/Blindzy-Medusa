import {
    Customer as MedusaCustomer,
    BeforeInsert,
  } from "@medusajs/medusa";
  import { Entity, Column } from "typeorm";
  import { generateEntityId } from "@medusajs/utils";
  
  @Entity()
  export class Customer extends MedusaCustomer {
    @Column({ nullable: true })
    phone: string;
  
    @Column({ nullable: true, unique: true })
    username: string;
  
    @BeforeInsert()
    private beforeInsert(): void {
      this.id = generateEntityId(this.id, "cus");
    }
  }
  