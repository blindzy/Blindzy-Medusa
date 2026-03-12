import { Migration } from '@mikro-orm/migrations';

export class Migration20260311_otp extends Migration {

  override async up(): Promise<void> {
    this.addSql(`
      create table if not exists "otp" (
        "id" varchar(255) not null,
        "email" varchar(255) not null,
        "otp" varchar(255) not null,
        "created_at" timestamptz not null,
        constraint "otp_pkey" primary key ("id")
      );
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "otp";`);
  }

}