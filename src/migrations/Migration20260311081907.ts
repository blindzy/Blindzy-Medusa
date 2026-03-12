import { Migration } from '@mikro-orm/migrations';

export class Migration20260311081907 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "customer" add column if not exists "pfp_url" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "customer" drop column if exists "pfp_url";`);
  }

}