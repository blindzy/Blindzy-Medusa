import { Migration } from '@mikro-orm/migrations';

export class Migration20260312054545_AddPasswordHash extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "customer" drop column "first_name", drop column "last_name", drop column "username";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "customer" add column "first_name" varchar(255) not null, add column "last_name" varchar(255) not null, add column "username" varchar(255) null;`);
  }

}
