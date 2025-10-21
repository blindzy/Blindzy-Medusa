import { Migration } from '@mikro-orm/migrations';

export class Migration20251021131549 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "provider_identity" drop constraint "provider_identity_auth_identity_id_foreign";`);

    this.addSql(`alter table "cart" drop constraint "cart_billing_address_id_foreign";`);

    this.addSql(`alter table "cart" drop constraint "cart_shipping_address_id_foreign";`);

    this.addSql(`alter table "cart_line_item_adjustment" drop constraint "cart_line_item_adjustment_item_id_foreign";`);

    this.addSql(`alter table "cart_line_item_tax_line" drop constraint "cart_line_item_tax_line_item_id_foreign";`);

    this.addSql(`alter table "cart_shipping_method_adjustment" drop constraint "cart_shipping_method_adjustment_shipping_method_id_foreign";`);

    this.addSql(`alter table "cart_shipping_method_tax_line" drop constraint "cart_shipping_method_tax_line_shipping_method_id_foreign";`);

    this.addSql(`alter table "customer_group_customer" drop constraint "customer_group_customer_customer_group_id_foreign";`);

    this.addSql(`alter table "fulfillment_item" drop constraint "fulfillment_item_fulfillment_id_foreign";`);

    this.addSql(`alter table "fulfillment_label" drop constraint "fulfillment_label_fulfillment_id_foreign";`);

    this.addSql(`alter table "fulfillment" drop constraint "fulfillment_delivery_address_id_foreign";`);

    this.addSql(`alter table "fulfillment" drop constraint "fulfillment_provider_id_foreign";`);

    this.addSql(`alter table "shipping_option" drop constraint "shipping_option_provider_id_foreign";`);

    this.addSql(`alter table "service_zone" drop constraint "service_zone_fulfillment_set_id_foreign";`);

    this.addSql(`alter table "inventory_level" drop constraint "inventory_level_inventory_item_id_foreign";`);

    this.addSql(`alter table "reservation_item" drop constraint "reservation_item_inventory_item_id_foreign";`);

    this.addSql(`alter table "notification" drop constraint "notification_provider_id_foreign";`);

    this.addSql(`alter table "order_change" drop constraint "order_change_order_id_foreign";`);

    this.addSql(`alter table "order_credit_line" drop constraint "order_credit_line_order_id_foreign";`);

    this.addSql(`alter table "order_item" drop constraint "order_item_order_id_foreign";`);

    this.addSql(`alter table "order_shipping" drop constraint "order_shipping_order_id_foreign";`);

    this.addSql(`alter table "order_summary" drop constraint "order_summary_order_id_foreign";`);

    this.addSql(`alter table "order_transaction" drop constraint "order_transaction_order_id_foreign";`);

    this.addSql(`alter table "order" drop constraint "order_billing_address_id_foreign";`);

    this.addSql(`alter table "order" drop constraint "order_shipping_address_id_foreign";`);

    this.addSql(`alter table "order_change_action" drop constraint "order_change_action_order_change_id_foreign";`);

    this.addSql(`alter table "order_line_item" drop constraint "order_line_item_totals_id_foreign";`);

    this.addSql(`alter table "order_item" drop constraint "order_item_item_id_foreign";`);

    this.addSql(`alter table "order_line_item_adjustment" drop constraint "order_line_item_adjustment_item_id_foreign";`);

    this.addSql(`alter table "order_line_item_tax_line" drop constraint "order_line_item_tax_line_item_id_foreign";`);

    this.addSql(`alter table "order_shipping_method_adjustment" drop constraint "order_shipping_method_adjustment_shipping_method_id_foreign";`);

    this.addSql(`alter table "order_shipping_method_tax_line" drop constraint "order_shipping_method_tax_line_shipping_method_id_foreign";`);

    this.addSql(`alter table "capture" drop constraint "capture_payment_id_foreign";`);

    this.addSql(`alter table "refund" drop constraint "refund_payment_id_foreign";`);

    this.addSql(`alter table "payment" drop constraint "payment_payment_collection_id_foreign";`);

    this.addSql(`alter table "payment_collection_payment_providers" drop constraint "payment_collection_payment_providers_payment_col_aa276_foreign";`);

    this.addSql(`alter table "payment_session" drop constraint "payment_session_payment_collection_id_foreign";`);

    this.addSql(`alter table "payment_collection_payment_providers" drop constraint "payment_collection_payment_providers_payment_pro_2d555_foreign";`);

    this.addSql(`alter table "price_rule" drop constraint "price_rule_price_id_foreign";`);

    this.addSql(`alter table "price" drop constraint "price_price_list_id_foreign";`);

    this.addSql(`alter table "price_list_rule" drop constraint "price_list_rule_price_list_id_foreign";`);

    this.addSql(`alter table "price" drop constraint "price_price_set_id_foreign";`);

    this.addSql(`alter table "product_category" drop constraint "product_category_parent_category_id_foreign";`);

    this.addSql(`alter table "product_category_product" drop constraint "product_category_product_product_category_id_foreign";`);

    this.addSql(`alter table "product" drop constraint "product_collection_id_foreign";`);

    this.addSql(`alter table "product_option_value" drop constraint "product_option_value_option_id_foreign";`);

    this.addSql(`alter table "product_variant_option" drop constraint "product_variant_option_option_value_id_foreign";`);

    this.addSql(`alter table "product_tags" drop constraint "product_tags_product_tag_id_foreign";`);

    this.addSql(`alter table "product" drop constraint "product_type_id_foreign";`);

    this.addSql(`alter table "product_variant_option" drop constraint "product_variant_option_variant_id_foreign";`);

    this.addSql(`alter table "promotion_application_method" drop constraint "promotion_application_method_promotion_id_foreign";`);

    this.addSql(`alter table "promotion_promotion_rule" drop constraint "promotion_promotion_rule_promotion_id_foreign";`);

    this.addSql(`alter table "application_method_buy_rules" drop constraint "application_method_buy_rules_application_method_id_foreign";`);

    this.addSql(`alter table "application_method_target_rules" drop constraint "application_method_target_rules_application_method_id_foreign";`);

    this.addSql(`alter table "promotion" drop constraint "promotion_campaign_id_foreign";`);

    this.addSql(`alter table "promotion_campaign_budget" drop constraint "promotion_campaign_budget_campaign_id_foreign";`);

    this.addSql(`alter table "application_method_buy_rules" drop constraint "application_method_buy_rules_promotion_rule_id_foreign";`);

    this.addSql(`alter table "application_method_target_rules" drop constraint "application_method_target_rules_promotion_rule_id_foreign";`);

    this.addSql(`alter table "promotion_promotion_rule" drop constraint "promotion_promotion_rule_promotion_rule_id_foreign";`);

    this.addSql(`alter table "promotion_rule_value" drop constraint "promotion_rule_value_promotion_rule_id_foreign";`);

    this.addSql(`alter table "region_country" drop constraint "region_country_region_id_foreign";`);

    this.addSql(`alter table "return_reason" drop constraint "return_reason_parent_return_reason_id_foreign";`);

    this.addSql(`alter table "geo_zone" drop constraint "geo_zone_service_zone_id_foreign";`);

    this.addSql(`alter table "shipping_option" drop constraint "shipping_option_service_zone_id_foreign";`);

    this.addSql(`alter table "fulfillment" drop constraint "fulfillment_shipping_option_id_foreign";`);

    this.addSql(`alter table "shipping_option_rule" drop constraint "shipping_option_rule_shipping_option_id_foreign";`);

    this.addSql(`alter table "shipping_option" drop constraint "shipping_option_shipping_option_type_id_foreign";`);

    this.addSql(`alter table "shipping_option" drop constraint "shipping_option_shipping_profile_id_foreign";`);

    this.addSql(`alter table "stock_location" drop constraint "stock_location_address_id_foreign";`);

    this.addSql(`alter table "store_currency" drop constraint "store_currency_store_id_foreign";`);

    this.addSql(`alter table "tax_region" drop constraint "FK_tax_region_provider_id";`);

    this.addSql(`alter table "tax_rate_rule" drop constraint "FK_tax_rate_rule_tax_rate_id";`);

    this.addSql(`alter table "tax_rate" drop constraint "FK_tax_rate_tax_region_id";`);

    this.addSql(`alter table "tax_region" drop constraint "FK_tax_region_parent_id";`);

    this.addSql(`create table "cart_item" ("id" text not null, "cart_id" uuid not null, "product_id" varchar(255) not null, "quantity" int not null, "customizations" jsonb not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "cart_item_pkey" primary key ("id"));`);

    this.addSql(`create table "card" ("id" varchar(255) not null, "customer_id" uuid not null, "card_type" varchar(255) not null, "encrypted_card_number" varchar(255) not null, "encrypted_security_code" varchar(255) not null, "expiry_date" varchar(255) not null, "card_name" varchar(255) not null, constraint "card_pkey" primary key ("id"));`);

    this.addSql(`create table "customization_option" ("id" varchar(255) not null, "product_id" varchar(255) not null, "name" varchar(255) not null, "input_type" varchar(255) not null, "required" boolean not null, constraint "customization_option_pkey" primary key ("id"));`);

    this.addSql(`create table "customization_value" ("id" varchar(255) not null, "option_id" varchar(255) not null, "value" varchar(255) not null, "image_url" varchar(255) null, "additional_price" numeric(10,2) null, constraint "customization_value_pkey" primary key ("id"));`);

    this.addSql(`create table "password_reset" ("email" varchar(255) not null, "otp" varchar(255) not null, "created_at" timestamptz not null, constraint "password_reset_pkey" primary key ("email"));`);

    this.addSql(`create table "custom_product" ("id" varchar(255) not null, "title" varchar(255) not null, "description" varchar(255) null, "type" varchar(255) not null, "base_price" numeric(10,2) not null, "image_url" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "custom_product_pkey" primary key ("id"));`);

    this.addSql(`create table "samples" ("id" varchar(255) not null, "name" varchar(255) not null, "color" varchar(255) not null, "price" int not null, "image" varchar(255) not null, "material" varchar(255) not null, "fabric" varchar(255) not null, "product" varchar(255) not null, constraint "samples_pkey" primary key ("id"));`);

    this.addSql(`create table "user_orders" ("id" varchar(255) not null, "customer_id" varchar(255) not null, "card_id" varchar(255) null, "address_id" varchar(255) not null, "items" jsonb not null, "total_price" int null, "status" varchar(255) not null default 'pending', "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_orders_pkey" primary key ("id"));`);

    this.addSql(`alter table "cart_item" add constraint "cart_item_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;`);

    this.addSql(`alter table "card" add constraint "card_customer_id_foreign" foreign key ("customer_id") references "customer" ("id") on update cascade;`);

    this.addSql(`drop table if exists "account_holder" cascade;`);

    this.addSql(`drop table if exists "api_key" cascade;`);

    this.addSql(`drop table if exists "application_method_buy_rules" cascade;`);

    this.addSql(`drop table if exists "application_method_target_rules" cascade;`);

    this.addSql(`drop table if exists "auth_identity" cascade;`);

    this.addSql(`drop table if exists "capture" cascade;`);

    this.addSql(`drop table if exists "cart_address" cascade;`);

    this.addSql(`drop table if exists "cart_line_item" cascade;`);

    this.addSql(`drop table if exists "cart_line_item_adjustment" cascade;`);

    this.addSql(`drop table if exists "cart_line_item_tax_line" cascade;`);

    this.addSql(`drop table if exists "cart_payment_collection" cascade;`);

    this.addSql(`drop table if exists "cart_promotion" cascade;`);

    this.addSql(`drop table if exists "cart_shipping_method" cascade;`);

    this.addSql(`drop table if exists "cart_shipping_method_adjustment" cascade;`);

    this.addSql(`drop table if exists "cart_shipping_method_tax_line" cascade;`);

    this.addSql(`drop table if exists "credit_line" cascade;`);

    this.addSql(`drop table if exists "currency" cascade;`);

    this.addSql(`drop table if exists "customer_account_holder" cascade;`);

    this.addSql(`drop table if exists "customer_group" cascade;`);

    this.addSql(`drop table if exists "customer_group_customer" cascade;`);

    this.addSql(`drop table if exists "fulfillment" cascade;`);

    this.addSql(`drop table if exists "fulfillment_address" cascade;`);

    this.addSql(`drop table if exists "fulfillment_item" cascade;`);

    this.addSql(`drop table if exists "fulfillment_label" cascade;`);

    this.addSql(`drop table if exists "fulfillment_provider" cascade;`);

    this.addSql(`drop table if exists "fulfillment_set" cascade;`);

    this.addSql(`drop table if exists "geo_zone" cascade;`);

    this.addSql(`drop table if exists "image" cascade;`);

    this.addSql(`drop table if exists "inventory_item" cascade;`);

    this.addSql(`drop table if exists "inventory_level" cascade;`);

    this.addSql(`drop table if exists "invite" cascade;`);

    this.addSql(`drop table if exists "link_module_migrations" cascade;`);

    this.addSql(`drop table if exists "location_fulfillment_provider" cascade;`);

    this.addSql(`drop table if exists "location_fulfillment_set" cascade;`);

    this.addSql(`drop table if exists "notification" cascade;`);

    this.addSql(`drop table if exists "notification_provider" cascade;`);

    this.addSql(`drop table if exists "order" cascade;`);

    this.addSql(`drop table if exists "order_address" cascade;`);

    this.addSql(`drop table if exists "order_cart" cascade;`);

    this.addSql(`drop table if exists "order_change" cascade;`);

    this.addSql(`drop table if exists "order_change_action" cascade;`);

    this.addSql(`drop table if exists "order_claim" cascade;`);

    this.addSql(`drop table if exists "order_claim_item" cascade;`);

    this.addSql(`drop table if exists "order_claim_item_image" cascade;`);

    this.addSql(`drop table if exists "order_credit_line" cascade;`);

    this.addSql(`drop table if exists "order_exchange" cascade;`);

    this.addSql(`drop table if exists "order_exchange_item" cascade;`);

    this.addSql(`drop table if exists "order_fulfillment" cascade;`);

    this.addSql(`drop table if exists "order_item" cascade;`);

    this.addSql(`drop table if exists "order_line_item" cascade;`);

    this.addSql(`drop table if exists "order_line_item_adjustment" cascade;`);

    this.addSql(`drop table if exists "order_line_item_tax_line" cascade;`);

    this.addSql(`drop table if exists "order_payment_collection" cascade;`);

    this.addSql(`drop table if exists "order_promotion" cascade;`);

    this.addSql(`drop table if exists "order_shipping" cascade;`);

    this.addSql(`drop table if exists "order_shipping_method" cascade;`);

    this.addSql(`drop table if exists "order_shipping_method_adjustment" cascade;`);

    this.addSql(`drop table if exists "order_shipping_method_tax_line" cascade;`);

    this.addSql(`drop table if exists "order_summary" cascade;`);

    this.addSql(`drop table if exists "order_transaction" cascade;`);

    this.addSql(`drop table if exists "payment" cascade;`);

    this.addSql(`drop table if exists "payment_collection" cascade;`);

    this.addSql(`drop table if exists "payment_collection_payment_providers" cascade;`);

    this.addSql(`drop table if exists "payment_provider" cascade;`);

    this.addSql(`drop table if exists "payment_session" cascade;`);

    this.addSql(`drop table if exists "price" cascade;`);

    this.addSql(`drop table if exists "price_list" cascade;`);

    this.addSql(`drop table if exists "price_list_rule" cascade;`);

    this.addSql(`drop table if exists "price_preference" cascade;`);

    this.addSql(`drop table if exists "price_rule" cascade;`);

    this.addSql(`drop table if exists "price_set" cascade;`);

    this.addSql(`drop table if exists "product_category" cascade;`);

    this.addSql(`drop table if exists "product_category_product" cascade;`);

    this.addSql(`drop table if exists "product_collection" cascade;`);

    this.addSql(`drop table if exists "product_option" cascade;`);

    this.addSql(`drop table if exists "product_option_value" cascade;`);

    this.addSql(`drop table if exists "product_sales_channel" cascade;`);

    this.addSql(`drop table if exists "product_shipping_profile" cascade;`);

    this.addSql(`drop table if exists "product_tag" cascade;`);

    this.addSql(`drop table if exists "product_tags" cascade;`);

    this.addSql(`drop table if exists "product_type" cascade;`);

    this.addSql(`drop table if exists "product_variant" cascade;`);

    this.addSql(`drop table if exists "product_variant_inventory_item" cascade;`);

    this.addSql(`drop table if exists "product_variant_option" cascade;`);

    this.addSql(`drop table if exists "product_variant_price_set" cascade;`);

    this.addSql(`drop table if exists "promotion" cascade;`);

    this.addSql(`drop table if exists "promotion_application_method" cascade;`);

    this.addSql(`drop table if exists "promotion_campaign" cascade;`);

    this.addSql(`drop table if exists "promotion_campaign_budget" cascade;`);

    this.addSql(`drop table if exists "promotion_promotion_rule" cascade;`);

    this.addSql(`drop table if exists "promotion_rule" cascade;`);

    this.addSql(`drop table if exists "promotion_rule_value" cascade;`);

    this.addSql(`drop table if exists "provider_identity" cascade;`);

    this.addSql(`drop table if exists "publishable_api_key_sales_channel" cascade;`);

    this.addSql(`drop table if exists "refund" cascade;`);

    this.addSql(`drop table if exists "refund_reason" cascade;`);

    this.addSql(`drop table if exists "region" cascade;`);

    this.addSql(`drop table if exists "region_country" cascade;`);

    this.addSql(`drop table if exists "region_payment_provider" cascade;`);

    this.addSql(`drop table if exists "reservation_item" cascade;`);

    this.addSql(`drop table if exists "return" cascade;`);

    this.addSql(`drop table if exists "return_fulfillment" cascade;`);

    this.addSql(`drop table if exists "return_item" cascade;`);

    this.addSql(`drop table if exists "return_reason" cascade;`);

    this.addSql(`drop table if exists "sales_channel" cascade;`);

    this.addSql(`drop table if exists "sales_channel_stock_location" cascade;`);

    this.addSql(`drop table if exists "script_migrations" cascade;`);

    this.addSql(`drop table if exists "service_zone" cascade;`);

    this.addSql(`drop table if exists "shipping_option" cascade;`);

    this.addSql(`drop table if exists "shipping_option_price_set" cascade;`);

    this.addSql(`drop table if exists "shipping_option_rule" cascade;`);

    this.addSql(`drop table if exists "shipping_option_type" cascade;`);

    this.addSql(`drop table if exists "shipping_profile" cascade;`);

    this.addSql(`drop table if exists "stock_location" cascade;`);

    this.addSql(`drop table if exists "stock_location_address" cascade;`);

    this.addSql(`drop table if exists "store" cascade;`);

    this.addSql(`drop table if exists "store_currency" cascade;`);

    this.addSql(`drop table if exists "tax_provider" cascade;`);

    this.addSql(`drop table if exists "tax_rate" cascade;`);

    this.addSql(`drop table if exists "tax_rate_rule" cascade;`);

    this.addSql(`drop table if exists "tax_region" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "workflow_execution" cascade;`);

    this.addSql(`alter table "customer_address" drop constraint "customer_address_customer_id_foreign";`);

    this.addSql(`alter table "otp" alter column "id" type text using ("id"::text);`);

    this.addSql(`alter table "product" drop constraint if exists "product_status_check";`);

    this.addSql(`drop index "IDX_customer_deleted_at";`);
    this.addSql(`drop index "IDX_customer_email_has_account_unique";`);
    this.addSql(`alter table "customer" drop column "metadata", drop column "deleted_at", drop column "created_by";`);

    this.addSql(`alter table "customer" add column "pfp_url" varchar(255) null;`);
    this.addSql(`alter table "customer" alter column "id" drop default;`);
    this.addSql(`alter table "customer" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "customer" alter column "company_name" type varchar(255) using ("company_name"::varchar(255));`);
    this.addSql(`alter table "customer" alter column "first_name" type varchar(255) using ("first_name"::varchar(255));`);
    this.addSql(`alter table "customer" alter column "first_name" set not null;`);
    this.addSql(`alter table "customer" alter column "last_name" type varchar(255) using ("last_name"::varchar(255));`);
    this.addSql(`alter table "customer" alter column "last_name" set not null;`);
    this.addSql(`alter table "customer" alter column "email" type varchar(255) using ("email"::varchar(255));`);
    this.addSql(`alter table "customer" alter column "email" set not null;`);
    this.addSql(`alter table "customer" alter column "phone" type varchar(255) using ("phone"::varchar(255));`);
    this.addSql(`alter table "customer" alter column "created_at" drop default;`);
    this.addSql(`alter table "customer" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "updated_at" drop default;`);
    this.addSql(`alter table "customer" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "customer" alter column "username" type varchar(255) using ("username"::varchar(255));`);
    this.addSql(`alter table "customer" alter column "password_hash" type varchar(255) using ("password_hash"::varchar(255));`);
    this.addSql(`alter table "customer" drop constraint "customer_username_key";`);
    this.addSql(`alter table "customer" add constraint "customer_username_unique" unique ("username");`);

    this.addSql(`drop index "IDX_cart_billing_address_id";`);
    this.addSql(`drop index "IDX_cart_currency_code";`);
    this.addSql(`drop index "IDX_cart_customer_id";`);
    this.addSql(`drop index "IDX_cart_deleted_at";`);
    this.addSql(`drop index "IDX_cart_region_id";`);
    this.addSql(`drop index "IDX_cart_sales_channel_id";`);
    this.addSql(`drop index "IDX_cart_shipping_address_id";`);
    this.addSql(`alter table "cart" drop column "region_id", drop column "sales_channel_id", drop column "shipping_address_id", drop column "billing_address_id", drop column "metadata", drop column "deleted_at", drop column "completed_at";`);

    this.addSql(`alter table "cart" alter column "id" drop default;`);
    this.addSql(`alter table "cart" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "cart" alter column "customer_id" drop default;`);
    this.addSql(`alter table "cart" alter column "customer_id" type uuid using ("customer_id"::text::uuid);`);
    this.addSql(`alter table "cart" alter column "customer_id" set not null;`);
    this.addSql(`alter table "cart" alter column "email" type varchar(255) using ("email"::varchar(255));`);
    this.addSql(`alter table "cart" alter column "email" set not null;`);
    this.addSql(`alter table "cart" alter column "currency_code" type varchar(255) using ("currency_code"::varchar(255));`);
    this.addSql(`alter table "cart" alter column "currency_code" set default 'USD';`);
    this.addSql(`alter table "cart" alter column "created_at" drop default;`);
    this.addSql(`alter table "cart" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "cart" alter column "updated_at" drop default;`);
    this.addSql(`alter table "cart" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);
    this.addSql(`alter table "cart" add constraint "cart_customer_id_foreign" foreign key ("customer_id") references "customer" ("id") on update cascade;`);

    this.addSql(`drop index "IDX_customer_address_customer_id";`);
    this.addSql(`drop index "IDX_customer_address_deleted_at";`);
    this.addSql(`drop index "IDX_customer_address_unique_customer_billing";`);
    this.addSql(`drop index "IDX_customer_address_unique_customer_shipping";`);
    this.addSql(`alter table "customer_address" drop column "metadata", drop column "deleted_at";`);

    this.addSql(`alter table "customer_address" add column "house_no" varchar(255) null, add column "street_no" varchar(255) null, add column "house_type" varchar(255) null;`);
    this.addSql(`alter table "customer_address" alter column "id" type varchar(255) using ("id"::varchar(255));`);
    this.addSql(`alter table "customer_address" alter column "customer_id" type varchar(255) using ("customer_id"::varchar(255));`);
    this.addSql(`alter table "customer_address" alter column "address_name" type varchar(255) using ("address_name"::varchar(255));`);
    this.addSql(`alter table "customer_address" alter column "company" type varchar(255) using ("company"::varchar(255));`);
    this.addSql(`alter table "customer_address" alter column "first_name" type varchar(255) using ("first_name"::varchar(255));`);
    this.addSql(`alter table "customer_address" alter column "first_name" set not null;`);
    this.addSql(`alter table "customer_address" alter column "last_name" type varchar(255) using ("last_name"::varchar(255));`);
    this.addSql(`alter table "customer_address" alter column "last_name" set not null;`);
    this.addSql(`alter table "customer_address" alter column "address_1" type varchar(255) using ("address_1"::varchar(255));`);
    this.addSql(`alter table "customer_address" alter column "address_1" set not null;`);
    this.addSql(`alter table "customer_address" alter column "address_2" type varchar(255) using ("address_2"::varchar(255));`);
    this.addSql(`alter table "customer_address" alter column "city" type varchar(255) using ("city"::varchar(255));`);
    this.addSql(`alter table "customer_address" alter column "city" set not null;`);
    this.addSql(`alter table "customer_address" alter column "country_code" type varchar(255) using ("country_code"::varchar(255));`);
    this.addSql(`alter table "customer_address" alter column "country_code" set not null;`);
    this.addSql(`alter table "customer_address" alter column "province" type varchar(255) using ("province"::varchar(255));`);
    this.addSql(`alter table "customer_address" alter column "postal_code" type varchar(255) using ("postal_code"::varchar(255));`);
    this.addSql(`alter table "customer_address" alter column "postal_code" set not null;`);
    this.addSql(`alter table "customer_address" alter column "phone" type varchar(255) using ("phone"::varchar(255));`);

    this.addSql(`alter table "otp" alter column "id" type varchar(255) using ("id"::varchar(255));`);
    this.addSql(`alter table "otp" alter column "otp" type varchar(255) using ("otp"::varchar(255));`);
    this.addSql(`alter table "otp" alter column "created_at" drop default;`);
    this.addSql(`alter table "otp" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);

    this.addSql(`drop index "IDX_product_collection_id";`);
    this.addSql(`drop index "IDX_product_deleted_at";`);
    this.addSql(`drop index "IDX_product_handle_unique";`);
    this.addSql(`drop index "IDX_product_type_id";`);

    this.addSql(`alter table "product" alter column "id" type varchar(255) using ("id"::varchar(255));`);
    this.addSql(`alter table "product" alter column "title" type varchar(255) using ("title"::varchar(255));`);
    this.addSql(`alter table "product" alter column "handle" type varchar(255) using ("handle"::varchar(255));`);
    this.addSql(`alter table "product" alter column "subtitle" type varchar(255) using ("subtitle"::varchar(255));`);
    this.addSql(`alter table "product" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "product" alter column "status" type varchar(255) using ("status"::varchar(255));`);
    this.addSql(`alter table "product" alter column "thumbnail" type varchar(255) using ("thumbnail"::varchar(255));`);
    this.addSql(`alter table "product" alter column "weight" type varchar(255) using ("weight"::varchar(255));`);
    this.addSql(`alter table "product" alter column "length" type varchar(255) using ("length"::varchar(255));`);
    this.addSql(`alter table "product" alter column "height" type varchar(255) using ("height"::varchar(255));`);
    this.addSql(`alter table "product" alter column "width" type varchar(255) using ("width"::varchar(255));`);
    this.addSql(`alter table "product" alter column "origin_country" type varchar(255) using ("origin_country"::varchar(255));`);
    this.addSql(`alter table "product" alter column "hs_code" type varchar(255) using ("hs_code"::varchar(255));`);
    this.addSql(`alter table "product" alter column "mid_code" type varchar(255) using ("mid_code"::varchar(255));`);
    this.addSql(`alter table "product" alter column "material" type varchar(255) using ("material"::varchar(255));`);
    this.addSql(`alter table "product" alter column "collection_id" type varchar(255) using ("collection_id"::varchar(255));`);
    this.addSql(`alter table "product" alter column "type_id" type varchar(255) using ("type_id"::varchar(255));`);
    this.addSql(`alter table "product" alter column "external_id" type varchar(255) using ("external_id"::varchar(255));`);
    this.addSql(`alter table "product" alter column "created_at" drop default;`);
    this.addSql(`alter table "product" alter column "created_at" type timestamptz using ("created_at"::timestamptz);`);
    this.addSql(`alter table "product" alter column "updated_at" drop default;`);
    this.addSql(`alter table "product" alter column "updated_at" type timestamptz using ("updated_at"::timestamptz);`);

    this.addSql(`drop type "claim_reason_enum";`);
    this.addSql(`drop type "order_claim_type_enum";`);
    this.addSql(`drop type "order_status_enum";`);
    this.addSql(`drop type "return_status_enum";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create type "claim_reason_enum" as enum ('missing_item', 'wrong_item', 'production_failure', 'other');`);
    this.addSql(`create type "order_claim_type_enum" as enum ('refund', 'replace');`);
    this.addSql(`create type "order_status_enum" as enum ('pending', 'completed', 'draft', 'archived', 'canceled', 'requires_action');`);
    this.addSql(`create type "return_status_enum" as enum ('open', 'requested', 'received', 'partially_received', 'canceled');`);
    this.addSql(`create table "account_holder" ("id" text not null, "provider_id" text not null, "external_id" text not null, "email" text null, "data" jsonb not null default '{}', "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "account_holder_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_account_holder_deleted_at" ON public.account_holder USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_account_holder_provider_id_external_id_unique" ON public.account_holder USING btree (provider_id, external_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "api_key" ("id" text not null, "token" text not null, "salt" text not null, "redacted" text not null, "title" text not null, "type" text check ("type" in ('publishable', 'secret')) not null, "last_used_at" timestamptz(6) null, "created_by" text not null, "created_at" timestamptz(6) not null default now(), "revoked_by" text null, "revoked_at" timestamptz(6) null, "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "api_key_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_api_key_deleted_at" ON public.api_key USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`alter table "api_key" add constraint "IDX_api_key_token_unique" unique ("token");`);
    this.addSql(`create index "IDX_api_key_type" on "api_key" ("type");`);

    this.addSql(`create table "application_method_buy_rules" ("application_method_id" text not null, "promotion_rule_id" text not null, constraint "application_method_buy_rules_pkey" primary key ("application_method_id", "promotion_rule_id"));`);

    this.addSql(`create table "application_method_target_rules" ("application_method_id" text not null, "promotion_rule_id" text not null, constraint "application_method_target_rules_pkey" primary key ("application_method_id", "promotion_rule_id"));`);

    this.addSql(`create table "auth_identity" ("id" text not null, "app_metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "auth_identity_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_auth_identity_deleted_at" ON public.auth_identity USING btree (deleted_at) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "capture" ("id" text not null, "amount" numeric not null, "raw_amount" jsonb not null, "payment_id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "created_by" text null, "metadata" jsonb null, constraint "capture_pkey" primary key ("id"));`);
    this.addSql(`create index "IDX_capture_deleted_at" on "capture" ("deleted_at");`);
    this.addSql(`CREATE INDEX "IDX_capture_payment_id" ON public.capture USING btree (payment_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "cart_address" ("id" text not null, "customer_id" text null, "company" text null, "first_name" text null, "last_name" text null, "address_1" text null, "address_2" text null, "city" text null, "country_code" text null, "province" text null, "postal_code" text null, "phone" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "cart_address_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_cart_address_deleted_at" ON public.cart_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);

    this.addSql(`create table "cart_line_item" ("id" text not null, "cart_id" text not null, "title" text not null, "subtitle" text null, "thumbnail" text null, "quantity" int4 not null, "variant_id" text null, "product_id" text null, "product_title" text null, "product_description" text null, "product_subtitle" text null, "product_type" text null, "product_collection" text null, "product_handle" text null, "variant_sku" text null, "variant_barcode" text null, "variant_title" text null, "variant_option_values" jsonb null, "requires_shipping" bool not null default true, "is_discountable" bool not null default true, "is_tax_inclusive" bool not null default false, "compare_at_unit_price" numeric null, "raw_compare_at_unit_price" jsonb null, "unit_price" numeric not null, "raw_unit_price" jsonb not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "product_type_id" text null, "is_custom_price" bool not null default false, "is_giftcard" bool not null default false, constraint "cart_line_item_pkey" primary key ("id"), constraint cart_line_item_unit_price_check check (unit_price >= 0));`);
    this.addSql(`CREATE INDEX "IDX_cart_line_item_cart_id" ON public.cart_line_item USING btree (cart_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_cart_line_item_deleted_at" ON public.cart_line_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_line_item_cart_id" ON public.cart_line_item USING btree (cart_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_line_item_product_id" ON public.cart_line_item USING btree (product_id) WHERE ((deleted_at IS NULL) AND (product_id IS NOT NULL));`);
    this.addSql(`CREATE INDEX "IDX_line_item_product_type_id" ON public.cart_line_item USING btree (product_type_id) WHERE ((deleted_at IS NULL) AND (product_type_id IS NOT NULL));`);
    this.addSql(`CREATE INDEX "IDX_line_item_variant_id" ON public.cart_line_item USING btree (variant_id) WHERE ((deleted_at IS NULL) AND (variant_id IS NOT NULL));`);

    this.addSql(`create table "cart_line_item_adjustment" ("id" text not null, "description" text null, "promotion_id" text null, "code" text null, "amount" numeric not null, "raw_amount" jsonb not null, "provider_id" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "item_id" text null, "is_tax_inclusive" bool not null default false, constraint "cart_line_item_adjustment_pkey" primary key ("id"), constraint cart_line_item_adjustment_check check (amount >= 0));`);
    this.addSql(`CREATE INDEX "IDX_adjustment_item_id" ON public.cart_line_item_adjustment USING btree (item_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_cart_line_item_adjustment_deleted_at" ON public.cart_line_item_adjustment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_cart_line_item_adjustment_item_id" ON public.cart_line_item_adjustment USING btree (item_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_line_item_adjustment_promotion_id" ON public.cart_line_item_adjustment USING btree (promotion_id) WHERE ((deleted_at IS NULL) AND (promotion_id IS NOT NULL));`);

    this.addSql(`create table "cart_line_item_tax_line" ("id" text not null, "description" text null, "tax_rate_id" text null, "code" text not null, "rate" float4 not null, "provider_id" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "item_id" text null, constraint "cart_line_item_tax_line_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_cart_line_item_tax_line_deleted_at" ON public.cart_line_item_tax_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_cart_line_item_tax_line_item_id" ON public.cart_line_item_tax_line USING btree (item_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_line_item_tax_line_tax_rate_id" ON public.cart_line_item_tax_line USING btree (tax_rate_id) WHERE ((deleted_at IS NULL) AND (tax_rate_id IS NOT NULL));`);
    this.addSql(`CREATE INDEX "IDX_tax_line_item_id" ON public.cart_line_item_tax_line USING btree (item_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "cart_payment_collection" ("cart_id" varchar(255) not null, "payment_collection_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "cart_payment_collection_pkey" primary key ("cart_id", "payment_collection_id"));`);
    this.addSql(`create index "IDX_cart_id_-4a39f6c9" on "cart_payment_collection" ("cart_id");`);
    this.addSql(`create index "IDX_deleted_at_-4a39f6c9" on "cart_payment_collection" ("deleted_at");`);
    this.addSql(`create index "IDX_id_-4a39f6c9" on "cart_payment_collection" ("id");`);
    this.addSql(`create index "IDX_payment_collection_id_-4a39f6c9" on "cart_payment_collection" ("payment_collection_id");`);

    this.addSql(`create table "cart_promotion" ("cart_id" varchar(255) not null, "promotion_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "cart_promotion_pkey" primary key ("cart_id", "promotion_id"));`);
    this.addSql(`create index "IDX_cart_id_-a9d4a70b" on "cart_promotion" ("cart_id");`);
    this.addSql(`create index "IDX_deleted_at_-a9d4a70b" on "cart_promotion" ("deleted_at");`);
    this.addSql(`create index "IDX_id_-a9d4a70b" on "cart_promotion" ("id");`);
    this.addSql(`create index "IDX_promotion_id_-a9d4a70b" on "cart_promotion" ("promotion_id");`);

    this.addSql(`create table "cart_shipping_method" ("id" text not null, "cart_id" text not null, "name" text not null, "description" jsonb null, "amount" numeric not null, "raw_amount" jsonb not null, "is_tax_inclusive" bool not null default false, "shipping_option_id" text null, "data" jsonb null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "cart_shipping_method_pkey" primary key ("id"), constraint cart_shipping_method_check check (amount >= 0));`);
    this.addSql(`CREATE INDEX "IDX_cart_shipping_method_cart_id" ON public.cart_shipping_method USING btree (cart_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_cart_shipping_method_deleted_at" ON public.cart_shipping_method USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_shipping_method_cart_id" ON public.cart_shipping_method USING btree (cart_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_shipping_method_option_id" ON public.cart_shipping_method USING btree (shipping_option_id) WHERE ((deleted_at IS NULL) AND (shipping_option_id IS NOT NULL));`);

    this.addSql(`create table "cart_shipping_method_adjustment" ("id" text not null, "description" text null, "promotion_id" text null, "code" text null, "amount" numeric not null, "raw_amount" jsonb not null, "provider_id" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "shipping_method_id" text null, constraint "cart_shipping_method_adjustment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_adjustment_shipping_method_id" ON public.cart_shipping_method_adjustment USING btree (shipping_method_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_cart_shipping_method_adjustment_deleted_at" ON public.cart_shipping_method_adjustment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_cart_shipping_method_adjustment_shipping_method_id" ON public.cart_shipping_method_adjustment USING btree (shipping_method_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_shipping_method_adjustment_promotion_id" ON public.cart_shipping_method_adjustment USING btree (promotion_id) WHERE ((deleted_at IS NULL) AND (promotion_id IS NOT NULL));`);

    this.addSql(`create table "cart_shipping_method_tax_line" ("id" text not null, "description" text null, "tax_rate_id" text null, "code" text not null, "rate" float4 not null, "provider_id" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "shipping_method_id" text null, constraint "cart_shipping_method_tax_line_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_cart_shipping_method_tax_line_deleted_at" ON public.cart_shipping_method_tax_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_cart_shipping_method_tax_line_shipping_method_id" ON public.cart_shipping_method_tax_line USING btree (shipping_method_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_shipping_method_tax_line_tax_rate_id" ON public.cart_shipping_method_tax_line USING btree (tax_rate_id) WHERE ((deleted_at IS NULL) AND (tax_rate_id IS NOT NULL));`);
    this.addSql(`CREATE INDEX "IDX_tax_line_shipping_method_id" ON public.cart_shipping_method_tax_line USING btree (shipping_method_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "credit_line" ("id" text not null, "cart_id" text not null, "reference" text null, "reference_id" text null, "amount" numeric not null, "raw_amount" jsonb not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "credit_line_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_cart_credit_line_reference_reference_id" ON public.credit_line USING btree (reference, reference_id) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_credit_line_cart_id" ON public.credit_line USING btree (cart_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_credit_line_deleted_at" ON public.credit_line USING btree (deleted_at) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "currency" ("code" text not null, "symbol" text not null, "symbol_native" text not null, "decimal_digits" int4 not null default 0, "rounding" numeric not null default 0, "raw_rounding" jsonb not null, "name" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "currency_pkey" primary key ("code"));`);

    this.addSql(`create table "customer_account_holder" ("customer_id" varchar(255) not null, "account_holder_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "customer_account_holder_pkey" primary key ("customer_id", "account_holder_id"));`);
    this.addSql(`create index "IDX_account_holder_id_5cb3a0c0" on "customer_account_holder" ("account_holder_id");`);
    this.addSql(`create index "IDX_customer_id_5cb3a0c0" on "customer_account_holder" ("customer_id");`);
    this.addSql(`create index "IDX_deleted_at_5cb3a0c0" on "customer_account_holder" ("deleted_at");`);
    this.addSql(`create index "IDX_id_5cb3a0c0" on "customer_account_holder" ("id");`);

    this.addSql(`create table "customer_group" ("id" text not null, "name" text not null, "metadata" jsonb null, "created_by" text null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "customer_group_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_customer_group_deleted_at" ON public.customer_group USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_customer_group_name" ON public.customer_group USING btree (name) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_customer_group_name_unique" ON public.customer_group USING btree (name) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "customer_group_customer" ("id" text not null, "customer_id" text not null, "customer_group_id" text not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "created_by" text null, "deleted_at" timestamptz(6) null, constraint "customer_group_customer_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_customer_group_customer_customer_group_id" ON public.customer_group_customer USING btree (customer_group_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`create index "IDX_customer_group_customer_customer_id" on "customer_group_customer" ("customer_id");`);
    this.addSql(`CREATE INDEX "IDX_customer_group_customer_deleted_at" ON public.customer_group_customer USING btree (deleted_at) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "fulfillment" ("id" text not null, "location_id" text not null, "packed_at" timestamptz(6) null, "shipped_at" timestamptz(6) null, "delivered_at" timestamptz(6) null, "canceled_at" timestamptz(6) null, "data" jsonb null, "provider_id" text null, "shipping_option_id" text null, "metadata" jsonb null, "delivery_address_id" text null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "marked_shipped_by" text null, "created_by" text null, "requires_shipping" bool not null default true, constraint "fulfillment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_fulfillment_deleted_at" ON public.fulfillment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_fulfillment_location_id" ON public.fulfillment USING btree (location_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_fulfillment_shipping_option_id" ON public.fulfillment USING btree (shipping_option_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "fulfillment_address" ("id" text not null, "company" text null, "first_name" text null, "last_name" text null, "address_1" text null, "address_2" text null, "city" text null, "country_code" text null, "province" text null, "postal_code" text null, "phone" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "fulfillment_address_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_fulfillment_address_deleted_at" ON public.fulfillment_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);

    this.addSql(`create table "fulfillment_item" ("id" text not null, "title" text not null, "sku" text not null, "barcode" text not null, "quantity" numeric not null, "raw_quantity" jsonb not null, "line_item_id" text null, "inventory_item_id" text null, "fulfillment_id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "fulfillment_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_fulfillment_item_deleted_at" ON public.fulfillment_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_fulfillment_item_fulfillment_id" ON public.fulfillment_item USING btree (fulfillment_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_fulfillment_item_inventory_item_id" ON public.fulfillment_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_fulfillment_item_line_item_id" ON public.fulfillment_item USING btree (line_item_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "fulfillment_label" ("id" text not null, "tracking_number" text not null, "tracking_url" text not null, "label_url" text not null, "fulfillment_id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "fulfillment_label_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_fulfillment_label_deleted_at" ON public.fulfillment_label USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_fulfillment_label_fulfillment_id" ON public.fulfillment_label USING btree (fulfillment_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "fulfillment_provider" ("id" text not null, "is_enabled" bool not null default true, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "fulfillment_provider_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_fulfillment_provider_deleted_at" ON public.fulfillment_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "fulfillment_set" ("id" text not null, "name" text not null, "type" text not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "fulfillment_set_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_fulfillment_set_deleted_at" ON public.fulfillment_set USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_fulfillment_set_name_unique" ON public.fulfillment_set USING btree (name) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "geo_zone" ("id" text not null, "type" text check ("type" in ('country', 'province', 'city', 'zip')) not null default 'country', "country_code" text not null, "province_code" text null, "city" text null, "service_zone_id" text not null, "postal_expression" jsonb null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "geo_zone_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_geo_zone_city" ON public.geo_zone USING btree (city) WHERE ((deleted_at IS NULL) AND (city IS NOT NULL));`);
    this.addSql(`CREATE INDEX "IDX_geo_zone_country_code" ON public.geo_zone USING btree (country_code) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_geo_zone_deleted_at" ON public.geo_zone USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_geo_zone_province_code" ON public.geo_zone USING btree (province_code) WHERE ((deleted_at IS NULL) AND (province_code IS NOT NULL));`);
    this.addSql(`CREATE INDEX "IDX_geo_zone_service_zone_id" ON public.geo_zone USING btree (service_zone_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "image" ("id" text not null, "url" text not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "rank" int4 not null default 0, "product_id" text not null, constraint "image_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_image_deleted_at" ON public.image USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_image_product_id" ON public.image USING btree (product_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_product_image_url" ON public.image USING btree (url) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "inventory_item" ("id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "sku" text null, "origin_country" text null, "hs_code" text null, "mid_code" text null, "material" text null, "weight" int4 null, "length" int4 null, "height" int4 null, "width" int4 null, "requires_shipping" bool not null default true, "description" text null, "title" text null, "thumbnail" text null, "metadata" jsonb null, constraint "inventory_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_inventory_item_deleted_at" ON public.inventory_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_inventory_item_sku" ON public.inventory_item USING btree (sku) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "inventory_level" ("id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "inventory_item_id" text not null, "location_id" text not null, "stocked_quantity" numeric not null default 0, "reserved_quantity" numeric not null default 0, "incoming_quantity" numeric not null default 0, "metadata" jsonb null, "raw_stocked_quantity" jsonb null, "raw_reserved_quantity" jsonb null, "raw_incoming_quantity" jsonb null, constraint "inventory_level_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_inventory_level_deleted_at" ON public.inventory_level USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_inventory_level_inventory_item_id" ON public.inventory_level USING btree (inventory_item_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_inventory_level_item_location" ON public.inventory_level USING btree (inventory_item_id, location_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_inventory_level_location_id" ON public.inventory_level USING btree (location_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_inventory_level_location_id_inventory_item_id" ON public.inventory_level USING btree (inventory_item_id, location_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "invite" ("id" text not null, "email" text not null, "accepted" bool not null default false, "token" text not null, "expires_at" timestamptz(6) not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "invite_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_invite_deleted_at" ON public.invite USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_invite_email_unique" ON public.invite USING btree (email) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_invite_token" ON public.invite USING btree (token) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "link_module_migrations" ("id" serial primary key, "table_name" varchar(255) not null, "link_descriptor" jsonb not null default '{}', "created_at" timestamp(6) null default CURRENT_TIMESTAMP);`);
    this.addSql(`alter table "link_module_migrations" add constraint "link_module_migrations_table_name_key" unique ("table_name");`);

    this.addSql(`create table "location_fulfillment_provider" ("stock_location_id" varchar(255) not null, "fulfillment_provider_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "location_fulfillment_provider_pkey" primary key ("stock_location_id", "fulfillment_provider_id"));`);
    this.addSql(`create index "IDX_deleted_at_-1e5992737" on "location_fulfillment_provider" ("deleted_at");`);
    this.addSql(`create index "IDX_fulfillment_provider_id_-1e5992737" on "location_fulfillment_provider" ("fulfillment_provider_id");`);
    this.addSql(`create index "IDX_id_-1e5992737" on "location_fulfillment_provider" ("id");`);
    this.addSql(`create index "IDX_stock_location_id_-1e5992737" on "location_fulfillment_provider" ("stock_location_id");`);

    this.addSql(`create table "location_fulfillment_set" ("stock_location_id" varchar(255) not null, "fulfillment_set_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "location_fulfillment_set_pkey" primary key ("stock_location_id", "fulfillment_set_id"));`);
    this.addSql(`create index "IDX_deleted_at_-e88adb96" on "location_fulfillment_set" ("deleted_at");`);
    this.addSql(`create index "IDX_fulfillment_set_id_-e88adb96" on "location_fulfillment_set" ("fulfillment_set_id");`);
    this.addSql(`create index "IDX_id_-e88adb96" on "location_fulfillment_set" ("id");`);
    this.addSql(`create index "IDX_stock_location_id_-e88adb96" on "location_fulfillment_set" ("stock_location_id");`);

    this.addSql(`create table "notification" ("id" text not null, "to" text not null, "channel" text not null, "template" text not null, "data" jsonb null, "trigger_type" text null, "resource_id" text null, "resource_type" text null, "receiver_id" text null, "original_notification_id" text null, "idempotency_key" text null, "external_id" text null, "provider_id" text null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "status" text check ("status" in ('pending', 'success', 'failure')) not null default 'pending', constraint "notification_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_notification_deleted_at" ON public.notification USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_notification_idempotency_key_unique" ON public.notification USING btree (idempotency_key) WHERE (deleted_at IS NULL);`);
    this.addSql(`create index "IDX_notification_provider_id" on "notification" ("provider_id");`);
    this.addSql(`create index "IDX_notification_receiver_id" on "notification" ("receiver_id");`);

    this.addSql(`create table "notification_provider" ("id" text not null, "handle" text not null, "name" text not null, "is_enabled" bool not null default true, "channels" text[] not null default '{}', "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "notification_provider_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_notification_provider_deleted_at" ON public.notification_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "order" ("id" text not null, "region_id" text null, "display_id" serial, "customer_id" text null, "version" int4 not null default 1, "sales_channel_id" text null, "status" "order_status_enum" not null default 'pending', "is_draft_order" bool not null default false, "email" text null, "currency_code" text not null, "shipping_address_id" text null, "billing_address_id" text null, "no_notification" bool null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "canceled_at" timestamptz(6) null, constraint "order_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_billing_address_id" ON public."order" USING btree (billing_address_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_currency_code" ON public."order" USING btree (currency_code) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_customer_id" ON public."order" USING btree (customer_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`create index "IDX_order_deleted_at" on "order" ("deleted_at");`);
    this.addSql(`CREATE INDEX "IDX_order_display_id" ON public."order" USING btree (display_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_is_draft_order" ON public."order" USING btree (is_draft_order) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_region_id" ON public."order" USING btree (region_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_shipping_address_id" ON public."order" USING btree (shipping_address_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "order_address" ("id" text not null, "customer_id" text null, "company" text null, "first_name" text null, "last_name" text null, "address_1" text null, "address_2" text null, "city" text null, "country_code" text null, "province" text null, "postal_code" text null, "phone" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "order_address_pkey" primary key ("id"));`);
    this.addSql(`create index "IDX_order_address_customer_id" on "order_address" ("customer_id");`);
    this.addSql(`CREATE INDEX "IDX_order_address_deleted_at" ON public.order_address USING btree (deleted_at) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "order_cart" ("order_id" varchar(255) not null, "cart_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "order_cart_pkey" primary key ("order_id", "cart_id"));`);
    this.addSql(`create index "IDX_cart_id_-71069c16" on "order_cart" ("cart_id");`);
    this.addSql(`create index "IDX_deleted_at_-71069c16" on "order_cart" ("deleted_at");`);
    this.addSql(`create index "IDX_id_-71069c16" on "order_cart" ("id");`);
    this.addSql(`create index "IDX_order_id_-71069c16" on "order_cart" ("order_id");`);

    this.addSql(`create table "order_change" ("id" text not null, "order_id" text not null, "version" int4 not null, "description" text null, "status" text check ("status" in ('confirmed', 'declined', 'requested', 'pending', 'canceled')) not null default 'pending', "internal_note" text null, "created_by" text null, "requested_by" text null, "requested_at" timestamptz(6) null, "confirmed_by" text null, "confirmed_at" timestamptz(6) null, "declined_by" text null, "declined_reason" text null, "metadata" jsonb null, "declined_at" timestamptz(6) null, "canceled_by" text null, "canceled_at" timestamptz(6) null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "change_type" text null, "deleted_at" timestamptz(6) null, "return_id" text null, "claim_id" text null, "exchange_id" text null, constraint "order_change_pkey" primary key ("id"));`);
    this.addSql(`create index "IDX_order_change_change_type" on "order_change" ("change_type");`);
    this.addSql(`CREATE INDEX "IDX_order_change_claim_id" ON public.order_change USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));`);
    this.addSql(`create index "IDX_order_change_deleted_at" on "order_change" ("deleted_at");`);
    this.addSql(`CREATE INDEX "IDX_order_change_exchange_id" ON public.order_change USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));`);
    this.addSql(`create index "IDX_order_change_order_id" on "order_change" ("order_id");`);
    this.addSql(`create index "IDX_order_change_order_id_version" on "order_change" ("order_id", "version");`);
    this.addSql(`CREATE INDEX "IDX_order_change_return_id" ON public.order_change USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));`);
    this.addSql(`create index "IDX_order_change_status" on "order_change" ("status");`);

    this.addSql(`create table "order_change_action" ("id" text not null, "order_id" text null, "version" int4 null, "ordering" bigserial, "order_change_id" text null, "reference" text null, "reference_id" text null, "action" text not null, "details" jsonb null, "amount" numeric null, "raw_amount" jsonb null, "internal_note" text null, "applied" bool not null default false, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "return_id" text null, "claim_id" text null, "exchange_id" text null, constraint "order_change_action_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_change_action_claim_id" ON public.order_change_action USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));`);
    this.addSql(`create index "IDX_order_change_action_deleted_at" on "order_change_action" ("deleted_at");`);
    this.addSql(`CREATE INDEX "IDX_order_change_action_exchange_id" ON public.order_change_action USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));`);
    this.addSql(`create index "IDX_order_change_action_order_change_id" on "order_change_action" ("order_change_id");`);
    this.addSql(`create index "IDX_order_change_action_order_id" on "order_change_action" ("order_id");`);
    this.addSql(`create index "IDX_order_change_action_ordering" on "order_change_action" ("ordering");`);
    this.addSql(`CREATE INDEX "IDX_order_change_action_return_id" ON public.order_change_action USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));`);

    this.addSql(`create table "order_claim" ("id" text not null, "order_id" text not null, "return_id" text null, "order_version" int4 not null, "display_id" serial, "type" "order_claim_type_enum" not null, "no_notification" bool null, "refund_amount" numeric null, "raw_refund_amount" jsonb null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "canceled_at" timestamptz(6) null, "created_by" text null, constraint "order_claim_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_claim_deleted_at" ON public.order_claim USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_claim_display_id" ON public.order_claim USING btree (display_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_claim_order_id" ON public.order_claim USING btree (order_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_claim_return_id" ON public.order_claim USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));`);

    this.addSql(`create table "order_claim_item" ("id" text not null, "claim_id" text not null, "item_id" text not null, "is_additional_item" bool not null default false, "reason" "claim_reason_enum" null, "quantity" numeric not null, "raw_quantity" jsonb not null, "note" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "order_claim_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_claim_item_claim_id" ON public.order_claim_item USING btree (claim_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_claim_item_deleted_at" ON public.order_claim_item USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_claim_item_item_id" ON public.order_claim_item USING btree (item_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "order_claim_item_image" ("id" text not null, "claim_item_id" text not null, "url" text not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "order_claim_item_image_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_claim_item_image_claim_item_id" ON public.order_claim_item_image USING btree (claim_item_id) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_claim_item_image_deleted_at" ON public.order_claim_item_image USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);

    this.addSql(`create table "order_credit_line" ("id" text not null, "order_id" text not null, "reference" text null, "reference_id" text null, "amount" numeric not null, "raw_amount" jsonb not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "order_credit_line_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_credit_line_deleted_at" ON public.order_credit_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_credit_line_order_id" ON public.order_credit_line USING btree (order_id) WHERE (deleted_at IS NOT NULL);`);

    this.addSql(`create table "order_exchange" ("id" text not null, "order_id" text not null, "return_id" text null, "order_version" int4 not null, "display_id" serial, "no_notification" bool null, "allow_backorder" bool not null default false, "difference_due" numeric null, "raw_difference_due" jsonb null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "canceled_at" timestamptz(6) null, "created_by" text null, constraint "order_exchange_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_exchange_deleted_at" ON public.order_exchange USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_exchange_display_id" ON public.order_exchange USING btree (display_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_exchange_order_id" ON public.order_exchange USING btree (order_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_exchange_return_id" ON public.order_exchange USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));`);

    this.addSql(`create table "order_exchange_item" ("id" text not null, "exchange_id" text not null, "item_id" text not null, "quantity" numeric not null, "raw_quantity" jsonb not null, "note" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "order_exchange_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_exchange_item_deleted_at" ON public.order_exchange_item USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_exchange_item_exchange_id" ON public.order_exchange_item USING btree (exchange_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_exchange_item_item_id" ON public.order_exchange_item USING btree (item_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "order_fulfillment" ("order_id" varchar(255) not null, "fulfillment_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "order_fulfillment_pkey" primary key ("order_id", "fulfillment_id"));`);
    this.addSql(`create index "IDX_deleted_at_-e8d2543e" on "order_fulfillment" ("deleted_at");`);
    this.addSql(`create index "IDX_fulfillment_id_-e8d2543e" on "order_fulfillment" ("fulfillment_id");`);
    this.addSql(`create index "IDX_id_-e8d2543e" on "order_fulfillment" ("id");`);
    this.addSql(`create index "IDX_order_id_-e8d2543e" on "order_fulfillment" ("order_id");`);

    this.addSql(`create table "order_item" ("id" text not null, "order_id" text not null, "version" int4 not null, "item_id" text not null, "quantity" numeric not null, "raw_quantity" jsonb not null, "fulfilled_quantity" numeric not null, "raw_fulfilled_quantity" jsonb not null, "shipped_quantity" numeric not null, "raw_shipped_quantity" jsonb not null, "return_requested_quantity" numeric not null, "raw_return_requested_quantity" jsonb not null, "return_received_quantity" numeric not null, "raw_return_received_quantity" jsonb not null, "return_dismissed_quantity" numeric not null, "raw_return_dismissed_quantity" jsonb not null, "written_off_quantity" numeric not null, "raw_written_off_quantity" jsonb not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "delivered_quantity" numeric not null default 0, "raw_delivered_quantity" jsonb not null, "unit_price" numeric null, "raw_unit_price" jsonb null, "compare_at_unit_price" numeric null, "raw_compare_at_unit_price" jsonb null, constraint "order_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_item_deleted_at" ON public.order_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_item_item_id" ON public.order_item USING btree (item_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_item_order_id" ON public.order_item USING btree (order_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_item_order_id_version" ON public.order_item USING btree (order_id, version) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "order_line_item" ("id" text not null, "totals_id" text null, "title" text not null, "subtitle" text null, "thumbnail" text null, "variant_id" text null, "product_id" text null, "product_title" text null, "product_description" text null, "product_subtitle" text null, "product_type" text null, "product_collection" text null, "product_handle" text null, "variant_sku" text null, "variant_barcode" text null, "variant_title" text null, "variant_option_values" jsonb null, "requires_shipping" bool not null default true, "is_discountable" bool not null default true, "is_tax_inclusive" bool not null default false, "compare_at_unit_price" numeric null, "raw_compare_at_unit_price" jsonb null, "unit_price" numeric not null, "raw_unit_price" jsonb not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "is_custom_price" bool not null default false, "product_type_id" text null, "is_giftcard" bool not null default false, constraint "order_line_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_line_item_product_id" ON public.order_line_item USING btree (product_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_line_item_variant_id" ON public.order_line_item USING btree (variant_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "order_line_item_adjustment" ("id" text not null, "description" text null, "promotion_id" text null, "code" text null, "amount" numeric not null, "raw_amount" jsonb not null, "provider_id" text null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "item_id" text not null, "deleted_at" timestamptz(6) null, "is_tax_inclusive" bool not null default false, constraint "order_line_item_adjustment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_line_item_adjustment_item_id" ON public.order_line_item_adjustment USING btree (item_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "order_line_item_tax_line" ("id" text not null, "description" text null, "tax_rate_id" text null, "code" text not null, "rate" numeric not null, "raw_rate" jsonb not null, "provider_id" text null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "item_id" text not null, "deleted_at" timestamptz(6) null, constraint "order_line_item_tax_line_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_line_item_tax_line_item_id" ON public.order_line_item_tax_line USING btree (item_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "order_payment_collection" ("order_id" varchar(255) not null, "payment_collection_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "order_payment_collection_pkey" primary key ("order_id", "payment_collection_id"));`);
    this.addSql(`create index "IDX_deleted_at_f42b9949" on "order_payment_collection" ("deleted_at");`);
    this.addSql(`create index "IDX_id_f42b9949" on "order_payment_collection" ("id");`);
    this.addSql(`create index "IDX_order_id_f42b9949" on "order_payment_collection" ("order_id");`);
    this.addSql(`create index "IDX_payment_collection_id_f42b9949" on "order_payment_collection" ("payment_collection_id");`);

    this.addSql(`create table "order_promotion" ("order_id" varchar(255) not null, "promotion_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "order_promotion_pkey" primary key ("order_id", "promotion_id"));`);
    this.addSql(`create index "IDX_deleted_at_-71518339" on "order_promotion" ("deleted_at");`);
    this.addSql(`create index "IDX_id_-71518339" on "order_promotion" ("id");`);
    this.addSql(`create index "IDX_order_id_-71518339" on "order_promotion" ("order_id");`);
    this.addSql(`create index "IDX_promotion_id_-71518339" on "order_promotion" ("promotion_id");`);

    this.addSql(`create table "order_shipping" ("id" text not null, "order_id" text not null, "version" int4 not null, "shipping_method_id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "return_id" text null, "claim_id" text null, "exchange_id" text null, constraint "order_shipping_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_shipping_claim_id" ON public.order_shipping USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));`);
    this.addSql(`CREATE INDEX "IDX_order_shipping_deleted_at" ON public.order_shipping USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_shipping_exchange_id" ON public.order_shipping USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));`);
    this.addSql(`CREATE INDEX "IDX_order_shipping_item_id" ON public.order_shipping USING btree (shipping_method_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_shipping_order_id" ON public.order_shipping USING btree (order_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_shipping_order_id_version" ON public.order_shipping USING btree (order_id, version) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_shipping_return_id" ON public.order_shipping USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));`);

    this.addSql(`create table "order_shipping_method" ("id" text not null, "name" text not null, "description" jsonb null, "amount" numeric not null, "raw_amount" jsonb not null, "is_tax_inclusive" bool not null default false, "shipping_option_id" text null, "data" jsonb null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "is_custom_amount" bool not null default false, constraint "order_shipping_method_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_shipping_method_shipping_option_id" ON public.order_shipping_method USING btree (shipping_option_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "order_shipping_method_adjustment" ("id" text not null, "description" text null, "promotion_id" text null, "code" text null, "amount" numeric not null, "raw_amount" jsonb not null, "provider_id" text null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "shipping_method_id" text not null, "deleted_at" timestamptz(6) null, constraint "order_shipping_method_adjustment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_shipping_method_adjustment_shipping_method_id" ON public.order_shipping_method_adjustment USING btree (shipping_method_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "order_shipping_method_tax_line" ("id" text not null, "description" text null, "tax_rate_id" text null, "code" text not null, "rate" numeric not null, "raw_rate" jsonb not null, "provider_id" text null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "shipping_method_id" text not null, "deleted_at" timestamptz(6) null, constraint "order_shipping_method_tax_line_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_shipping_method_tax_line_shipping_method_id" ON public.order_shipping_method_tax_line USING btree (shipping_method_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "order_summary" ("id" text not null, "order_id" text not null, "version" int4 not null default 1, "totals" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "order_summary_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_summary_deleted_at" ON public.order_summary USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_summary_order_id_version" ON public.order_summary USING btree (order_id, version) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "order_transaction" ("id" text not null, "order_id" text not null, "version" int4 not null default 1, "amount" numeric not null, "raw_amount" jsonb not null, "currency_code" text not null, "reference" text null, "reference_id" text null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "return_id" text null, "claim_id" text null, "exchange_id" text null, constraint "order_transaction_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_order_transaction_claim_id" ON public.order_transaction USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));`);
    this.addSql(`CREATE INDEX "IDX_order_transaction_currency_code" ON public.order_transaction USING btree (currency_code) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_transaction_exchange_id" ON public.order_transaction USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));`);
    this.addSql(`CREATE INDEX "IDX_order_transaction_order_id_version" ON public.order_transaction USING btree (order_id, version) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_transaction_reference_id" ON public.order_transaction USING btree (reference_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_order_transaction_return_id" ON public.order_transaction USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));`);

    this.addSql(`create table "payment" ("id" text not null, "amount" numeric not null, "raw_amount" jsonb not null, "currency_code" text not null, "provider_id" text not null, "data" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "captured_at" timestamptz(6) null, "canceled_at" timestamptz(6) null, "payment_collection_id" text not null, "payment_session_id" text not null, "metadata" jsonb null, constraint "payment_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_payment_deleted_at" ON public.payment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_payment_payment_collection_id" ON public.payment USING btree (payment_collection_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`create index "IDX_payment_payment_session_id" on "payment" ("payment_session_id");`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_payment_payment_session_id_unique" ON public.payment USING btree (payment_session_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_payment_provider_id" ON public.payment USING btree (provider_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "payment_collection" ("id" text not null, "currency_code" text not null, "amount" numeric not null, "raw_amount" jsonb not null, "authorized_amount" numeric null, "raw_authorized_amount" jsonb null, "captured_amount" numeric null, "raw_captured_amount" jsonb null, "refunded_amount" numeric null, "raw_refunded_amount" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "completed_at" timestamptz(6) null, "status" text check ("status" in ('not_paid', 'awaiting', 'authorized', 'partially_authorized', 'canceled', 'failed', 'partially_captured', 'completed')) not null default 'not_paid', "metadata" jsonb null, constraint "payment_collection_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_payment_collection_deleted_at" ON public.payment_collection USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);

    this.addSql(`create table "payment_collection_payment_providers" ("payment_collection_id" text not null, "payment_provider_id" text not null, constraint "payment_collection_payment_providers_pkey" primary key ("payment_collection_id", "payment_provider_id"));`);

    this.addSql(`create table "payment_provider" ("id" text not null, "is_enabled" bool not null default true, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "payment_provider_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_payment_provider_deleted_at" ON public.payment_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "payment_session" ("id" text not null, "currency_code" text not null, "amount" numeric not null, "raw_amount" jsonb not null, "provider_id" text not null, "data" jsonb not null default '{}', "context" jsonb null, "status" text check ("status" in ('authorized', 'captured', 'pending', 'requires_more', 'error', 'canceled')) not null default 'pending', "authorized_at" timestamptz(6) null, "payment_collection_id" text not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "payment_session_pkey" primary key ("id"));`);
    this.addSql(`create index "IDX_payment_session_deleted_at" on "payment_session" ("deleted_at");`);
    this.addSql(`CREATE INDEX "IDX_payment_session_payment_collection_id" ON public.payment_session USING btree (payment_collection_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "price" ("id" text not null, "title" text null, "price_set_id" text not null, "currency_code" text not null, "raw_amount" jsonb not null, "rules_count" int4 null default 0, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "price_list_id" text null, "amount" numeric not null, "min_quantity" int4 null, "max_quantity" int4 null, constraint "price_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_price_currency_code" ON public.price USING btree (currency_code) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_price_deleted_at" ON public.price USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_price_price_list_id" ON public.price USING btree (price_list_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_price_price_set_id" ON public.price USING btree (price_set_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "price_list" ("id" text not null, "status" text check ("status" in ('active', 'draft')) not null default 'draft', "starts_at" timestamptz(6) null, "ends_at" timestamptz(6) null, "rules_count" int4 null default 0, "title" text not null, "description" text not null, "type" text check ("type" in ('sale', 'override')) not null default 'sale', "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "price_list_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_price_list_deleted_at" ON public.price_list USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);

    this.addSql(`create table "price_list_rule" ("id" text not null, "price_list_id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "value" jsonb null, "attribute" text not null default '', constraint "price_list_rule_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_price_list_rule_attribute" ON public.price_list_rule USING btree (attribute) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_price_list_rule_deleted_at" ON public.price_list_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_price_list_rule_price_list_id" ON public.price_list_rule USING btree (price_list_id) WHERE (deleted_at IS NOT NULL);`);

    this.addSql(`create table "price_preference" ("id" text not null, "attribute" text not null, "value" text null, "is_tax_inclusive" bool not null default false, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "price_preference_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_price_preference_attribute_value" ON public.price_preference USING btree (attribute, value) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_price_preference_deleted_at" ON public.price_preference USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);

    this.addSql(`create table "price_rule" ("id" text not null, "value" text not null, "priority" int4 not null default 0, "price_id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "attribute" text not null default '', "operator" text check ("operator" in ('gte', 'lte', 'gt', 'lt', 'eq')) not null default 'eq', constraint "price_rule_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_price_rule_attribute" ON public.price_rule USING btree (attribute) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_price_rule_attribute_value" ON public.price_rule USING btree (attribute, value) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_price_rule_deleted_at" ON public.price_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`create index "IDX_price_rule_operator" on "price_rule" ("operator");`);
    this.addSql(`CREATE INDEX "IDX_price_rule_operator_value" ON public.price_rule USING btree (operator, value) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_price_rule_price_id" ON public.price_rule USING btree (price_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_price_rule_price_id_attribute_operator_unique" ON public.price_rule USING btree (price_id, attribute, operator) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "price_set" ("id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "price_set_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_price_set_deleted_at" ON public.price_set USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);

    this.addSql(`create table "product_category" ("id" text not null, "name" text not null, "description" text not null default '', "handle" text not null, "mpath" text not null, "is_active" bool not null default false, "is_internal" bool not null default false, "rank" int4 not null default 0, "parent_category_id" text null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "metadata" jsonb null, constraint "product_category_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_category_handle_unique" ON public.product_category USING btree (handle) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_product_category_parent_category_id" ON public.product_category USING btree (parent_category_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_product_category_path" ON public.product_category USING btree (mpath) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "product_category_product" ("product_id" text not null, "product_category_id" text not null, constraint "product_category_product_pkey" primary key ("product_id", "product_category_id"));`);

    this.addSql(`create table "product_collection" ("id" text not null, "title" text not null, "handle" text not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "product_collection_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_collection_handle_unique" ON public.product_collection USING btree (handle) WHERE (deleted_at IS NULL);`);
    this.addSql(`create index "IDX_product_category_deleted_at" on "product_collection" ("deleted_at");`);
    this.addSql(`create index "IDX_product_collection_deleted_at" on "product_collection" ("deleted_at");`);

    this.addSql(`create table "product_option" ("id" text not null, "title" text not null, "product_id" text not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "product_option_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_option_product_id_title_unique" ON public.product_option USING btree (product_id, title) WHERE (deleted_at IS NULL);`);
    this.addSql(`create index "IDX_product_option_deleted_at" on "product_option" ("deleted_at");`);
    this.addSql(`CREATE INDEX "IDX_product_option_product_id" ON public.product_option USING btree (product_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "product_option_value" ("id" text not null, "value" text not null, "option_id" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "product_option_value_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_option_value_option_id_unique" ON public.product_option_value USING btree (option_id, value) WHERE (deleted_at IS NULL);`);
    this.addSql(`create index "IDX_product_option_value_deleted_at" on "product_option_value" ("deleted_at");`);
    this.addSql(`CREATE INDEX "IDX_product_option_value_option_id" ON public.product_option_value USING btree (option_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "product_sales_channel" ("product_id" varchar(255) not null, "sales_channel_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "product_sales_channel_pkey" primary key ("product_id", "sales_channel_id"));`);
    this.addSql(`create index "IDX_deleted_at_20b454295" on "product_sales_channel" ("deleted_at");`);
    this.addSql(`create index "IDX_id_20b454295" on "product_sales_channel" ("id");`);
    this.addSql(`create index "IDX_product_id_20b454295" on "product_sales_channel" ("product_id");`);
    this.addSql(`create index "IDX_sales_channel_id_20b454295" on "product_sales_channel" ("sales_channel_id");`);

    this.addSql(`create table "product_shipping_profile" ("product_id" varchar(255) not null, "shipping_profile_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "product_shipping_profile_pkey" primary key ("product_id", "shipping_profile_id"));`);
    this.addSql(`create index "IDX_deleted_at_17a262437" on "product_shipping_profile" ("deleted_at");`);
    this.addSql(`create index "IDX_id_17a262437" on "product_shipping_profile" ("id");`);
    this.addSql(`create index "IDX_product_id_17a262437" on "product_shipping_profile" ("product_id");`);
    this.addSql(`create index "IDX_shipping_profile_id_17a262437" on "product_shipping_profile" ("shipping_profile_id");`);

    this.addSql(`create table "product_tag" ("id" text not null, "value" text not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "product_tag_pkey" primary key ("id"));`);
    this.addSql(`create index "IDX_product_tag_deleted_at" on "product_tag" ("deleted_at");`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_tag_value_unique" ON public.product_tag USING btree (value) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "product_tags" ("product_id" text not null, "product_tag_id" text not null, constraint "product_tags_pkey" primary key ("product_id", "product_tag_id"));`);

    this.addSql(`create table "product_type" ("id" text not null, "value" text not null, "metadata" json null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "product_type_pkey" primary key ("id"));`);
    this.addSql(`create index "IDX_product_type_deleted_at" on "product_type" ("deleted_at");`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_type_value_unique" ON public.product_type USING btree (value) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "product_variant" ("id" text not null, "title" text not null, "sku" text null, "barcode" text null, "ean" text null, "upc" text null, "allow_backorder" bool not null default false, "manage_inventory" bool not null default true, "hs_code" text null, "origin_country" text null, "mid_code" text null, "material" text null, "weight" int4 null, "length" int4 null, "height" int4 null, "width" int4 null, "metadata" jsonb null, "variant_rank" int4 null default 0, "product_id" text null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "product_variant_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_product_variant_barcode_unique" ON public.product_variant USING btree (barcode) WHERE (deleted_at IS NULL);`);
    this.addSql(`create index "IDX_product_variant_deleted_at" on "product_variant" ("deleted_at");`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_product_variant_ean_unique" ON public.product_variant USING btree (ean) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_product_variant_id_product_id" ON public.product_variant USING btree (id, product_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_product_variant_product_id" ON public.product_variant USING btree (product_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_product_variant_sku_unique" ON public.product_variant USING btree (sku) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_product_variant_upc_unique" ON public.product_variant USING btree (upc) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "product_variant_inventory_item" ("variant_id" varchar(255) not null, "inventory_item_id" varchar(255) not null, "id" varchar(255) not null, "required_quantity" int4 not null default 1, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "product_variant_inventory_item_pkey" primary key ("variant_id", "inventory_item_id"));`);
    this.addSql(`create index "IDX_deleted_at_17b4c4e35" on "product_variant_inventory_item" ("deleted_at");`);
    this.addSql(`create index "IDX_id_17b4c4e35" on "product_variant_inventory_item" ("id");`);
    this.addSql(`create index "IDX_inventory_item_id_17b4c4e35" on "product_variant_inventory_item" ("inventory_item_id");`);
    this.addSql(`create index "IDX_variant_id_17b4c4e35" on "product_variant_inventory_item" ("variant_id");`);

    this.addSql(`create table "product_variant_option" ("variant_id" text not null, "option_value_id" text not null, constraint "product_variant_option_pkey" primary key ("variant_id", "option_value_id"));`);

    this.addSql(`create table "product_variant_price_set" ("variant_id" varchar(255) not null, "price_set_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "product_variant_price_set_pkey" primary key ("variant_id", "price_set_id"));`);
    this.addSql(`create index "IDX_deleted_at_52b23597" on "product_variant_price_set" ("deleted_at");`);
    this.addSql(`create index "IDX_id_52b23597" on "product_variant_price_set" ("id");`);
    this.addSql(`create index "IDX_price_set_id_52b23597" on "product_variant_price_set" ("price_set_id");`);
    this.addSql(`create index "IDX_variant_id_52b23597" on "product_variant_price_set" ("variant_id");`);

    this.addSql(`create table "promotion" ("id" text not null, "code" text not null, "campaign_id" text null, "is_automatic" bool not null default false, "type" text check ("type" in ('standard', 'buyget')) not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "status" text check ("status" in ('draft', 'active', 'inactive')) not null default 'draft', "is_tax_inclusive" bool not null default false, constraint "promotion_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_promotion_campaign_id" ON public.promotion USING btree (campaign_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_promotion_deleted_at" ON public.promotion USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_promotion_status" ON public.promotion USING btree (status) WHERE (deleted_at IS NULL);`);
    this.addSql(`create index "IDX_promotion_type" on "promotion" ("type");`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_unique_promotion_code" ON public.promotion USING btree (code) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "promotion_application_method" ("id" text not null, "value" numeric null, "raw_value" jsonb null, "max_quantity" int4 null, "apply_to_quantity" int4 null, "buy_rules_min_quantity" int4 null, "type" text check ("type" in ('fixed', 'percentage')) not null, "target_type" text check ("target_type" in ('order', 'shipping_methods', 'items')) not null, "allocation" text check ("allocation" in ('each', 'across')) null, "promotion_id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "currency_code" text null, constraint "promotion_application_method_pkey" primary key ("id"));`);
    this.addSql(`create index "IDX_application_method_allocation" on "promotion_application_method" ("allocation");`);
    this.addSql(`create index "IDX_application_method_target_type" on "promotion_application_method" ("target_type");`);
    this.addSql(`create index "IDX_application_method_type" on "promotion_application_method" ("type");`);
    this.addSql(`CREATE INDEX "IDX_promotion_application_method_currency_code" ON public.promotion_application_method USING btree (currency_code) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_promotion_application_method_deleted_at" ON public.promotion_application_method USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_promotion_application_method_promotion_id_unique" ON public.promotion_application_method USING btree (promotion_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "promotion_campaign" ("id" text not null, "name" text not null, "description" text null, "campaign_identifier" text not null, "starts_at" timestamptz(6) null, "ends_at" timestamptz(6) null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "promotion_campaign_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_promotion_campaign_campaign_identifier_unique" ON public.promotion_campaign USING btree (campaign_identifier) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_promotion_campaign_deleted_at" ON public.promotion_campaign USING btree (deleted_at) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "promotion_campaign_budget" ("id" text not null, "type" text check ("type" in ('spend', 'usage')) not null, "campaign_id" text not null, "limit" numeric null, "raw_limit" jsonb null, "used" numeric not null default 0, "raw_used" jsonb not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "currency_code" text null, constraint "promotion_campaign_budget_pkey" primary key ("id"));`);
    this.addSql(`create index "IDX_campaign_budget_type" on "promotion_campaign_budget" ("type");`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_promotion_campaign_budget_campaign_id_unique" ON public.promotion_campaign_budget USING btree (campaign_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_promotion_campaign_budget_deleted_at" ON public.promotion_campaign_budget USING btree (deleted_at) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "promotion_promotion_rule" ("promotion_id" text not null, "promotion_rule_id" text not null, constraint "promotion_promotion_rule_pkey" primary key ("promotion_id", "promotion_rule_id"));`);

    this.addSql(`create table "promotion_rule" ("id" text not null, "description" text null, "attribute" text not null, "operator" text check ("operator" in ('gte', 'lte', 'gt', 'lt', 'eq', 'ne', 'in')) not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "promotion_rule_pkey" primary key ("id"));`);
    this.addSql(`create index "IDX_promotion_rule_attribute" on "promotion_rule" ("attribute");`);
    this.addSql(`CREATE INDEX "IDX_promotion_rule_deleted_at" ON public.promotion_rule USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`create index "IDX_promotion_rule_operator" on "promotion_rule" ("operator");`);

    this.addSql(`create table "promotion_rule_value" ("id" text not null, "promotion_rule_id" text not null, "value" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "promotion_rule_value_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_promotion_rule_value_deleted_at" ON public.promotion_rule_value USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_promotion_rule_value_promotion_rule_id" ON public.promotion_rule_value USING btree (promotion_rule_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "provider_identity" ("id" text not null, "entity_id" text not null, "provider" text not null, "auth_identity_id" text not null, "user_metadata" jsonb null, "provider_metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "provider_identity_pkey" primary key ("id"));`);
    this.addSql(`create index "IDX_provider_identity_auth_identity_id" on "provider_identity" ("auth_identity_id");`);
    this.addSql(`CREATE INDEX "IDX_provider_identity_deleted_at" ON public.provider_identity USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`alter table "provider_identity" add constraint "IDX_provider_identity_provider_entity_id" unique ("entity_id", "provider");`);

    this.addSql(`create table "publishable_api_key_sales_channel" ("publishable_key_id" varchar(255) not null, "sales_channel_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "publishable_api_key_sales_channel_pkey" primary key ("publishable_key_id", "sales_channel_id"));`);
    this.addSql(`create index "IDX_deleted_at_-1d67bae40" on "publishable_api_key_sales_channel" ("deleted_at");`);
    this.addSql(`create index "IDX_id_-1d67bae40" on "publishable_api_key_sales_channel" ("id");`);
    this.addSql(`create index "IDX_publishable_key_id_-1d67bae40" on "publishable_api_key_sales_channel" ("publishable_key_id");`);
    this.addSql(`create index "IDX_sales_channel_id_-1d67bae40" on "publishable_api_key_sales_channel" ("sales_channel_id");`);

    this.addSql(`create table "refund" ("id" text not null, "amount" numeric not null, "raw_amount" jsonb not null, "payment_id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "created_by" text null, "metadata" jsonb null, "refund_reason_id" text null, "note" text null, constraint "refund_pkey" primary key ("id"));`);
    this.addSql(`create index "IDX_refund_deleted_at" on "refund" ("deleted_at");`);
    this.addSql(`CREATE INDEX "IDX_refund_payment_id" ON public.refund USING btree (payment_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_refund_refund_reason_id" ON public.refund USING btree (refund_reason_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "refund_reason" ("id" text not null, "label" text not null, "description" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "refund_reason_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_refund_reason_deleted_at" ON public.refund_reason USING btree (deleted_at) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "region" ("id" text not null, "name" text not null, "currency_code" text not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "automatic_taxes" bool not null default true, constraint "region_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_region_deleted_at" ON public.region USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);

    this.addSql(`create table "region_country" ("iso_2" text not null, "iso_3" text not null, "num_code" text not null, "name" text not null, "display_name" text not null, "region_id" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "region_country_pkey" primary key ("iso_2"));`);
    this.addSql(`CREATE INDEX "IDX_region_country_deleted_at" ON public.region_country USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_region_country_region_id" ON public.region_country USING btree (region_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`alter table "region_country" add constraint "IDX_region_country_region_id_iso_2_unique" unique ("region_id", "iso_2");`);

    this.addSql(`create table "region_payment_provider" ("region_id" varchar(255) not null, "payment_provider_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "region_payment_provider_pkey" primary key ("region_id", "payment_provider_id"));`);
    this.addSql(`create index "IDX_deleted_at_1c934dab0" on "region_payment_provider" ("deleted_at");`);
    this.addSql(`create index "IDX_id_1c934dab0" on "region_payment_provider" ("id");`);
    this.addSql(`create index "IDX_payment_provider_id_1c934dab0" on "region_payment_provider" ("payment_provider_id");`);
    this.addSql(`create index "IDX_region_id_1c934dab0" on "region_payment_provider" ("region_id");`);

    this.addSql(`create table "reservation_item" ("id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "line_item_id" text null, "location_id" text not null, "quantity" numeric not null, "external_id" text null, "description" text null, "created_by" text null, "metadata" jsonb null, "inventory_item_id" text not null, "allow_backorder" bool null default false, "raw_quantity" jsonb null, constraint "reservation_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_reservation_item_deleted_at" ON public.reservation_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_reservation_item_inventory_item_id" ON public.reservation_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_reservation_item_line_item_id" ON public.reservation_item USING btree (line_item_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_reservation_item_location_id" ON public.reservation_item USING btree (location_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "return" ("id" text not null, "order_id" text not null, "claim_id" text null, "exchange_id" text null, "order_version" int4 not null, "display_id" serial, "status" "return_status_enum" not null default 'open', "no_notification" bool null, "refund_amount" numeric null, "raw_refund_amount" jsonb null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "received_at" timestamptz(6) null, "canceled_at" timestamptz(6) null, "location_id" text null, "requested_at" timestamptz(6) null, "created_by" text null, constraint "return_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_return_claim_id" ON public.return USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));`);
    this.addSql(`CREATE INDEX "IDX_return_display_id" ON public.return USING btree (display_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_return_exchange_id" ON public.return USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));`);
    this.addSql(`CREATE INDEX "IDX_return_order_id" ON public.return USING btree (order_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "return_fulfillment" ("return_id" varchar(255) not null, "fulfillment_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "return_fulfillment_pkey" primary key ("return_id", "fulfillment_id"));`);
    this.addSql(`create index "IDX_deleted_at_-31ea43a" on "return_fulfillment" ("deleted_at");`);
    this.addSql(`create index "IDX_fulfillment_id_-31ea43a" on "return_fulfillment" ("fulfillment_id");`);
    this.addSql(`create index "IDX_id_-31ea43a" on "return_fulfillment" ("id");`);
    this.addSql(`create index "IDX_return_id_-31ea43a" on "return_fulfillment" ("return_id");`);

    this.addSql(`create table "return_item" ("id" text not null, "return_id" text not null, "reason_id" text null, "item_id" text not null, "quantity" numeric not null, "raw_quantity" jsonb not null, "received_quantity" numeric not null default 0, "raw_received_quantity" jsonb not null, "note" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "damaged_quantity" numeric not null default 0, "raw_damaged_quantity" jsonb not null, constraint "return_item_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_return_item_deleted_at" ON public.return_item USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_return_item_item_id" ON public.return_item USING btree (item_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_return_item_reason_id" ON public.return_item USING btree (reason_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_return_item_return_id" ON public.return_item USING btree (return_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "return_reason" ("id" varchar not null, "value" varchar not null, "label" varchar not null, "description" varchar null, "metadata" jsonb null, "parent_return_reason_id" varchar null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "return_reason_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_return_reason_value" ON public.return_reason USING btree (value) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "sales_channel" ("id" text not null, "name" text not null, "description" text null, "is_disabled" bool not null default false, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "sales_channel_pkey" primary key ("id"));`);
    this.addSql(`create index "IDX_sales_channel_deleted_at" on "sales_channel" ("deleted_at");`);

    this.addSql(`create table "sales_channel_stock_location" ("sales_channel_id" varchar(255) not null, "stock_location_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "sales_channel_stock_location_pkey" primary key ("sales_channel_id", "stock_location_id"));`);
    this.addSql(`create index "IDX_deleted_at_26d06f470" on "sales_channel_stock_location" ("deleted_at");`);
    this.addSql(`create index "IDX_id_26d06f470" on "sales_channel_stock_location" ("id");`);
    this.addSql(`create index "IDX_sales_channel_id_26d06f470" on "sales_channel_stock_location" ("sales_channel_id");`);
    this.addSql(`create index "IDX_stock_location_id_26d06f470" on "sales_channel_stock_location" ("stock_location_id");`);

    this.addSql(`create table "script_migrations" ("id" serial primary key, "script_name" varchar(255) not null, "created_at" timestamptz(6) null default CURRENT_TIMESTAMP, "finished_at" timestamptz(6) null);`);
    this.addSql(`alter table "script_migrations" add constraint "idx_script_name_unique" unique ("script_name");`);

    this.addSql(`create table "service_zone" ("id" text not null, "name" text not null, "metadata" jsonb null, "fulfillment_set_id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "service_zone_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_service_zone_deleted_at" ON public.service_zone USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_service_zone_fulfillment_set_id" ON public.service_zone USING btree (fulfillment_set_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_service_zone_name_unique" ON public.service_zone USING btree (name) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "shipping_option" ("id" text not null, "name" text not null, "price_type" text check ("price_type" in ('calculated', 'flat')) not null default 'flat', "service_zone_id" text not null, "shipping_profile_id" text null, "provider_id" text null, "data" jsonb null, "metadata" jsonb null, "shipping_option_type_id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "shipping_option_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_shipping_option_deleted_at" ON public.shipping_option USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_shipping_option_provider_id" ON public.shipping_option USING btree (provider_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_shipping_option_service_zone_id" ON public.shipping_option USING btree (service_zone_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_shipping_option_shipping_profile_id" ON public.shipping_option USING btree (shipping_profile_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "shipping_option_price_set" ("shipping_option_id" varchar(255) not null, "price_set_id" varchar(255) not null, "id" varchar(255) not null, "created_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "updated_at" timestamptz(6) not null default CURRENT_TIMESTAMP, "deleted_at" timestamptz(6) null, constraint "shipping_option_price_set_pkey" primary key ("shipping_option_id", "price_set_id"));`);
    this.addSql(`create index "IDX_deleted_at_ba32fa9c" on "shipping_option_price_set" ("deleted_at");`);
    this.addSql(`create index "IDX_id_ba32fa9c" on "shipping_option_price_set" ("id");`);
    this.addSql(`create index "IDX_price_set_id_ba32fa9c" on "shipping_option_price_set" ("price_set_id");`);
    this.addSql(`create index "IDX_shipping_option_id_ba32fa9c" on "shipping_option_price_set" ("shipping_option_id");`);

    this.addSql(`create table "shipping_option_rule" ("id" text not null, "attribute" text not null, "operator" text check ("operator" in ('in', 'eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'nin')) not null, "value" jsonb null, "shipping_option_id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "shipping_option_rule_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_shipping_option_rule_deleted_at" ON public.shipping_option_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_shipping_option_rule_shipping_option_id" ON public.shipping_option_rule USING btree (shipping_option_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "shipping_option_type" ("id" text not null, "label" text not null, "description" text null, "code" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "shipping_option_type_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_shipping_option_type_deleted_at" ON public.shipping_option_type USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);

    this.addSql(`create table "shipping_profile" ("id" text not null, "name" text not null, "type" text not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "shipping_profile_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_shipping_profile_deleted_at" ON public.shipping_profile USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_shipping_profile_name_unique" ON public.shipping_profile USING btree (name) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "stock_location" ("id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "name" text not null, "address_id" text null, "metadata" jsonb null, constraint "stock_location_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_stock_location_address_id_unique" ON public.stock_location USING btree (address_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_stock_location_deleted_at" ON public.stock_location USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);

    this.addSql(`create table "stock_location_address" ("id" text not null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, "address_1" text not null, "address_2" text null, "company" text null, "city" text null, "country_code" text not null, "phone" text null, "province" text null, "postal_code" text null, "metadata" jsonb null, constraint "stock_location_address_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_stock_location_address_deleted_at" ON public.stock_location_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);

    this.addSql(`create table "store" ("id" text not null, "name" text not null default 'Medusa Store', "default_sales_channel_id" text null, "default_region_id" text null, "default_location_id" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "store_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_store_deleted_at" ON public.store USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);

    this.addSql(`create table "store_currency" ("id" text not null, "currency_code" text not null, "is_default" bool not null default false, "store_id" text null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "store_currency_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_store_currency_deleted_at" ON public.store_currency USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_store_currency_store_id" ON public.store_currency USING btree (store_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "tax_provider" ("id" text not null, "is_enabled" bool not null default true, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "tax_provider_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_tax_provider_deleted_at" ON public.tax_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "tax_rate" ("id" text not null, "rate" float4 null, "code" text not null, "name" text not null, "is_default" bool not null default false, "is_combinable" bool not null default false, "tax_region_id" text not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "created_by" text null, "deleted_at" timestamptz(6) null, constraint "tax_rate_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_single_default_region" ON public.tax_rate USING btree (tax_region_id) WHERE ((is_default = true) AND (deleted_at IS NULL));`);
    this.addSql(`CREATE INDEX "IDX_tax_rate_deleted_at" ON public.tax_rate USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_tax_rate_tax_region_id" ON public.tax_rate USING btree (tax_region_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "tax_rate_rule" ("id" text not null, "tax_rate_id" text not null, "reference_id" text not null, "reference" text not null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "created_by" text null, "deleted_at" timestamptz(6) null, constraint "tax_rate_rule_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_tax_rate_rule_deleted_at" ON public.tax_rate_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_tax_rate_rule_reference_id" ON public.tax_rate_rule USING btree (reference_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_tax_rate_rule_tax_rate_id" ON public.tax_rate_rule USING btree (tax_rate_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_tax_rate_rule_unique_rate_reference" ON public.tax_rate_rule USING btree (tax_rate_id, reference_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "tax_region" ("id" text not null, "provider_id" text null, "country_code" text not null, "province_code" text null, "parent_id" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "created_by" text null, "deleted_at" timestamptz(6) null, constraint "tax_region_pkey" primary key ("id"), constraint CK_tax_region_country_top_level check ((parent_id IS NULL) OR (province_code IS NOT NULL)), constraint CK_tax_region_country_top_level check ((parent_id IS NULL) OR (province_code IS NOT NULL)), constraint CK_tax_region_provider_top_level check ((parent_id IS NULL) OR (provider_id IS NULL)), constraint CK_tax_region_provider_top_level check ((parent_id IS NULL) OR (provider_id IS NULL)));`);
    this.addSql(`CREATE INDEX "IDX_tax_region_deleted_at" ON public.tax_region USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`create index "IDX_tax_region_parent_id" on "tax_region" ("parent_id");`);
    this.addSql(`CREATE INDEX "IDX_tax_region_provider_id" ON public.tax_region USING btree (provider_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_tax_region_unique_country_nullable_province" ON public.tax_region USING btree (country_code) WHERE ((province_code IS NULL) AND (deleted_at IS NULL));`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_tax_region_unique_country_province" ON public.tax_region USING btree (country_code, province_code) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "user" ("id" text not null, "first_name" text null, "last_name" text null, "email" text not null, "avatar_url" text null, "metadata" jsonb null, "created_at" timestamptz(6) not null default now(), "updated_at" timestamptz(6) not null default now(), "deleted_at" timestamptz(6) null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX "IDX_user_deleted_at" ON public."user" USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_user_email_unique" ON public."user" USING btree (email) WHERE (deleted_at IS NULL);`);

    this.addSql(`create table "workflow_execution" ("id" varchar not null, "workflow_id" varchar not null, "transaction_id" varchar not null, "execution" jsonb null, "context" jsonb null, "state" varchar not null, "created_at" timestamp(6) not null default now(), "updated_at" timestamp(6) not null default now(), "deleted_at" timestamp(6) null, "retention_time" int4 null, "run_id" text not null default '01JZT36TEN1HHN9Q6CT258QZRM', constraint "workflow_execution_pkey" primary key ("workflow_id", "transaction_id", "run_id"));`);
    this.addSql(`CREATE INDEX "IDX_workflow_execution_deleted_at" ON public.workflow_execution USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_workflow_execution_id" ON public.workflow_execution USING btree (id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_workflow_execution_state" ON public.workflow_execution USING btree (state) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_workflow_execution_transaction_id" ON public.workflow_execution USING btree (transaction_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_workflow_execution_workflow_id" ON public.workflow_execution USING btree (workflow_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_workflow_execution_workflow_id_transaction_id_run_id_unique" ON public.workflow_execution USING btree (workflow_id, transaction_id, run_id) WHERE (deleted_at IS NULL);`);

    this.addSql(`alter table "application_method_buy_rules" add constraint "application_method_buy_rules_application_method_id_foreign" foreign key ("application_method_id") references "promotion_application_method" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "application_method_buy_rules" add constraint "application_method_buy_rules_promotion_rule_id_foreign" foreign key ("promotion_rule_id") references "promotion_rule" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "application_method_target_rules" add constraint "application_method_target_rules_application_method_id_foreign" foreign key ("application_method_id") references "promotion_application_method" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "application_method_target_rules" add constraint "application_method_target_rules_promotion_rule_id_foreign" foreign key ("promotion_rule_id") references "promotion_rule" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "capture" add constraint "capture_payment_id_foreign" foreign key ("payment_id") references "payment" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "cart_line_item" add constraint "cart_line_item_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "cart_line_item_adjustment" add constraint "cart_line_item_adjustment_item_id_foreign" foreign key ("item_id") references "cart_line_item" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "cart_line_item_tax_line" add constraint "cart_line_item_tax_line_item_id_foreign" foreign key ("item_id") references "cart_line_item" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "cart_shipping_method" add constraint "cart_shipping_method_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "cart_shipping_method_adjustment" add constraint "cart_shipping_method_adjustment_shipping_method_id_foreign" foreign key ("shipping_method_id") references "cart_shipping_method" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "cart_shipping_method_tax_line" add constraint "cart_shipping_method_tax_line_shipping_method_id_foreign" foreign key ("shipping_method_id") references "cart_shipping_method" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "credit_line" add constraint "credit_line_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade on delete no action;`);

    this.addSql(`alter table "customer_group_customer" add constraint "customer_group_customer_customer_group_id_foreign" foreign key ("customer_group_id") references "customer_group" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "customer_group_customer" add constraint "customer_group_customer_customer_id_foreign" foreign key ("customer_id") references "customer" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "fulfillment" add constraint "fulfillment_delivery_address_id_foreign" foreign key ("delivery_address_id") references "fulfillment_address" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "fulfillment" add constraint "fulfillment_provider_id_foreign" foreign key ("provider_id") references "fulfillment_provider" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "fulfillment" add constraint "fulfillment_shipping_option_id_foreign" foreign key ("shipping_option_id") references "shipping_option" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "fulfillment_item" add constraint "fulfillment_item_fulfillment_id_foreign" foreign key ("fulfillment_id") references "fulfillment" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "fulfillment_label" add constraint "fulfillment_label_fulfillment_id_foreign" foreign key ("fulfillment_id") references "fulfillment" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "geo_zone" add constraint "geo_zone_service_zone_id_foreign" foreign key ("service_zone_id") references "service_zone" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "image" add constraint "image_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "inventory_level" add constraint "inventory_level_inventory_item_id_foreign" foreign key ("inventory_item_id") references "inventory_item" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "notification" add constraint "notification_provider_id_foreign" foreign key ("provider_id") references "notification_provider" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "order" add constraint "order_billing_address_id_foreign" foreign key ("billing_address_id") references "order_address" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "order" add constraint "order_shipping_address_id_foreign" foreign key ("shipping_address_id") references "order_address" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "order_change" add constraint "order_change_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "order_change_action" add constraint "order_change_action_order_change_id_foreign" foreign key ("order_change_id") references "order_change" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "order_credit_line" add constraint "order_credit_line_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "order_item" add constraint "order_item_item_id_foreign" foreign key ("item_id") references "order_line_item" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "order_line_item" add constraint "order_line_item_totals_id_foreign" foreign key ("totals_id") references "order_item" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "order_line_item_adjustment" add constraint "order_line_item_adjustment_item_id_foreign" foreign key ("item_id") references "order_line_item" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "order_line_item_tax_line" add constraint "order_line_item_tax_line_item_id_foreign" foreign key ("item_id") references "order_line_item" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "order_shipping" add constraint "order_shipping_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "order_shipping_method_adjustment" add constraint "order_shipping_method_adjustment_shipping_method_id_foreign" foreign key ("shipping_method_id") references "order_shipping_method" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "order_shipping_method_tax_line" add constraint "order_shipping_method_tax_line_shipping_method_id_foreign" foreign key ("shipping_method_id") references "order_shipping_method" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "order_summary" add constraint "order_summary_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "order_transaction" add constraint "order_transaction_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "payment" add constraint "payment_payment_collection_id_foreign" foreign key ("payment_collection_id") references "payment_collection" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "payment_collection_payment_providers" add constraint "payment_collection_payment_providers_payment_col_aa276_foreign" foreign key ("payment_collection_id") references "payment_collection" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "payment_collection_payment_providers" add constraint "payment_collection_payment_providers_payment_pro_2d555_foreign" foreign key ("payment_provider_id") references "payment_provider" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "payment_session" add constraint "payment_session_payment_collection_id_foreign" foreign key ("payment_collection_id") references "payment_collection" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "price" add constraint "price_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "price" add constraint "price_price_set_id_foreign" foreign key ("price_set_id") references "price_set" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "price_list_rule" add constraint "price_list_rule_price_list_id_foreign" foreign key ("price_list_id") references "price_list" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "price_rule" add constraint "price_rule_price_id_foreign" foreign key ("price_id") references "price" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "product_category" add constraint "product_category_parent_category_id_foreign" foreign key ("parent_category_id") references "product_category" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "product_category_product" add constraint "product_category_product_product_category_id_foreign" foreign key ("product_category_id") references "product_category" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "product_category_product" add constraint "product_category_product_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "product_option" add constraint "product_option_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "product_option_value" add constraint "product_option_value_option_id_foreign" foreign key ("option_id") references "product_option" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "product_tags" add constraint "product_tags_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "product_tags" add constraint "product_tags_product_tag_id_foreign" foreign key ("product_tag_id") references "product_tag" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "product_variant" add constraint "product_variant_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "product_variant_option" add constraint "product_variant_option_option_value_id_foreign" foreign key ("option_value_id") references "product_option_value" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "product_variant_option" add constraint "product_variant_option_variant_id_foreign" foreign key ("variant_id") references "product_variant" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "promotion" add constraint "promotion_campaign_id_foreign" foreign key ("campaign_id") references "promotion_campaign" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "promotion_application_method" add constraint "promotion_application_method_promotion_id_foreign" foreign key ("promotion_id") references "promotion" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "promotion_campaign_budget" add constraint "promotion_campaign_budget_campaign_id_foreign" foreign key ("campaign_id") references "promotion_campaign" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "promotion_promotion_rule" add constraint "promotion_promotion_rule_promotion_id_foreign" foreign key ("promotion_id") references "promotion" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "promotion_promotion_rule" add constraint "promotion_promotion_rule_promotion_rule_id_foreign" foreign key ("promotion_rule_id") references "promotion_rule" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "promotion_rule_value" add constraint "promotion_rule_value_promotion_rule_id_foreign" foreign key ("promotion_rule_id") references "promotion_rule" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "provider_identity" add constraint "provider_identity_auth_identity_id_foreign" foreign key ("auth_identity_id") references "auth_identity" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "refund" add constraint "refund_payment_id_foreign" foreign key ("payment_id") references "payment" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "region_country" add constraint "region_country_region_id_foreign" foreign key ("region_id") references "region" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "reservation_item" add constraint "reservation_item_inventory_item_id_foreign" foreign key ("inventory_item_id") references "inventory_item" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "return_reason" add constraint "return_reason_parent_return_reason_id_foreign" foreign key ("parent_return_reason_id") references "return_reason" ("id") on update no action on delete no action;`);

    this.addSql(`alter table "service_zone" add constraint "service_zone_fulfillment_set_id_foreign" foreign key ("fulfillment_set_id") references "fulfillment_set" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "shipping_option" add constraint "shipping_option_provider_id_foreign" foreign key ("provider_id") references "fulfillment_provider" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "shipping_option" add constraint "shipping_option_service_zone_id_foreign" foreign key ("service_zone_id") references "service_zone" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "shipping_option" add constraint "shipping_option_shipping_option_type_id_foreign" foreign key ("shipping_option_type_id") references "shipping_option_type" ("id") on update cascade on delete no action;`);
    this.addSql(`alter table "shipping_option" add constraint "shipping_option_shipping_profile_id_foreign" foreign key ("shipping_profile_id") references "shipping_profile" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "shipping_option_rule" add constraint "shipping_option_rule_shipping_option_id_foreign" foreign key ("shipping_option_id") references "shipping_option" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "stock_location" add constraint "stock_location_address_id_foreign" foreign key ("address_id") references "stock_location_address" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "store_currency" add constraint "store_currency_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "tax_rate" add constraint "FK_tax_rate_tax_region_id" foreign key ("tax_region_id") references "tax_region" ("id") on update no action on delete cascade;`);

    this.addSql(`alter table "tax_rate_rule" add constraint "FK_tax_rate_rule_tax_rate_id" foreign key ("tax_rate_id") references "tax_rate" ("id") on update no action on delete cascade;`);

    this.addSql(`alter table "tax_region" add constraint "FK_tax_region_parent_id" foreign key ("parent_id") references "tax_region" ("id") on update no action on delete cascade;`);
    this.addSql(`alter table "tax_region" add constraint "FK_tax_region_provider_id" foreign key ("provider_id") references "tax_provider" ("id") on update no action on delete set null;`);

    this.addSql(`drop table if exists "cart_item" cascade;`);

    this.addSql(`drop table if exists "card" cascade;`);

    this.addSql(`drop table if exists "customization_option" cascade;`);

    this.addSql(`drop table if exists "customization_value" cascade;`);

    this.addSql(`drop table if exists "password_reset" cascade;`);

    this.addSql(`drop table if exists "custom_product" cascade;`);

    this.addSql(`drop table if exists "samples" cascade;`);

    this.addSql(`drop table if exists "user_orders" cascade;`);

    this.addSql(`alter table "cart" alter column "id" type text using ("id"::text);`);
    this.addSql(`alter table "cart" alter column "customer_id" type text using ("customer_id"::text);`);

    this.addSql(`alter table "cart" drop constraint "cart_customer_id_foreign";`);

    this.addSql(`alter table "customer" alter column "id" type text using ("id"::text);`);

    this.addSql(`alter table "cart" add column "region_id" text null, add column "sales_channel_id" text null, add column "shipping_address_id" text null, add column "billing_address_id" text null, add column "metadata" jsonb null, add column "deleted_at" timestamptz(6) null, add column "completed_at" timestamptz(6) null;`);
    this.addSql(`alter table "cart" alter column "id" type text using ("id"::text);`);
    this.addSql(`alter table "cart" alter column "email" type text using ("email"::text);`);
    this.addSql(`alter table "cart" alter column "email" drop not null;`);
    this.addSql(`alter table "cart" alter column "currency_code" drop default;`);
    this.addSql(`alter table "cart" alter column "currency_code" type text using ("currency_code"::text);`);
    this.addSql(`alter table "cart" alter column "customer_id" type text using ("customer_id"::text);`);
    this.addSql(`alter table "cart" alter column "customer_id" drop not null;`);
    this.addSql(`alter table "cart" alter column "created_at" type timestamptz(6) using ("created_at"::timestamptz(6));`);
    this.addSql(`alter table "cart" alter column "created_at" set default now();`);
    this.addSql(`alter table "cart" alter column "updated_at" type timestamptz(6) using ("updated_at"::timestamptz(6));`);
    this.addSql(`alter table "cart" alter column "updated_at" set default now();`);
    this.addSql(`alter table "cart" add constraint "cart_shipping_address_id_foreign" foreign key ("shipping_address_id") references "cart_address" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "cart" add constraint "cart_billing_address_id_foreign" foreign key ("billing_address_id") references "cart_address" ("id") on update cascade on delete set null;`);
    this.addSql(`CREATE INDEX "IDX_cart_billing_address_id" ON public.cart USING btree (billing_address_id) WHERE ((deleted_at IS NULL) AND (billing_address_id IS NOT NULL));`);
    this.addSql(`create index "IDX_cart_currency_code" on "cart" ("currency_code");`);
    this.addSql(`CREATE INDEX "IDX_cart_customer_id" ON public.cart USING btree (customer_id) WHERE ((deleted_at IS NULL) AND (customer_id IS NOT NULL));`);
    this.addSql(`CREATE INDEX "IDX_cart_deleted_at" ON public.cart USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);`);
    this.addSql(`CREATE INDEX "IDX_cart_region_id" ON public.cart USING btree (region_id) WHERE ((deleted_at IS NULL) AND (region_id IS NOT NULL));`);
    this.addSql(`CREATE INDEX "IDX_cart_sales_channel_id" ON public.cart USING btree (sales_channel_id) WHERE ((deleted_at IS NULL) AND (sales_channel_id IS NOT NULL));`);
    this.addSql(`CREATE INDEX "IDX_cart_shipping_address_id" ON public.cart USING btree (shipping_address_id) WHERE ((deleted_at IS NULL) AND (shipping_address_id IS NOT NULL));`);

    this.addSql(`alter table "customer" drop column "pfp_url";`);

    this.addSql(`alter table "customer" add column "metadata" jsonb null, add column "deleted_at" timestamptz(6) null, add column "created_by" text null;`);
    this.addSql(`alter table "customer" alter column "id" type text using ("id"::text);`);
    this.addSql(`alter table "customer" alter column "first_name" type text using ("first_name"::text);`);
    this.addSql(`alter table "customer" alter column "first_name" drop not null;`);
    this.addSql(`alter table "customer" alter column "last_name" type text using ("last_name"::text);`);
    this.addSql(`alter table "customer" alter column "last_name" drop not null;`);
    this.addSql(`alter table "customer" alter column "email" type text using ("email"::text);`);
    this.addSql(`alter table "customer" alter column "email" drop not null;`);
    this.addSql(`alter table "customer" alter column "phone" type text using ("phone"::text);`);
    this.addSql(`alter table "customer" alter column "username" type varchar using ("username"::varchar);`);
    this.addSql(`alter table "customer" alter column "password_hash" type text using ("password_hash"::text);`);
    this.addSql(`alter table "customer" alter column "created_at" type timestamptz(6) using ("created_at"::timestamptz(6));`);
    this.addSql(`alter table "customer" alter column "created_at" set default now();`);
    this.addSql(`alter table "customer" alter column "updated_at" type timestamptz(6) using ("updated_at"::timestamptz(6));`);
    this.addSql(`alter table "customer" alter column "updated_at" set default now();`);
    this.addSql(`alter table "customer" alter column "company_name" type text using ("company_name"::text);`);
    this.addSql(`CREATE INDEX "IDX_customer_deleted_at" ON public.customer USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_customer_email_has_account_unique" ON public.customer USING btree (email, has_account) WHERE (deleted_at IS NULL);`);
    this.addSql(`alter table "customer" drop constraint "customer_username_unique";`);
    this.addSql(`alter table "customer" add constraint "customer_username_key" unique ("username");`);

    this.addSql(`alter table "customer_address" drop column "house_no", drop column "street_no", drop column "house_type";`);

    this.addSql(`alter table "customer_address" add column "metadata" jsonb null, add column "deleted_at" timestamptz(6) null;`);
    this.addSql(`alter table "customer_address" alter column "id" type text using ("id"::text);`);
    this.addSql(`alter table "customer_address" alter column "customer_id" type text using ("customer_id"::text);`);
    this.addSql(`alter table "customer_address" alter column "address_name" type text using ("address_name"::text);`);
    this.addSql(`alter table "customer_address" alter column "company" type text using ("company"::text);`);
    this.addSql(`alter table "customer_address" alter column "first_name" type text using ("first_name"::text);`);
    this.addSql(`alter table "customer_address" alter column "first_name" drop not null;`);
    this.addSql(`alter table "customer_address" alter column "last_name" type text using ("last_name"::text);`);
    this.addSql(`alter table "customer_address" alter column "last_name" drop not null;`);
    this.addSql(`alter table "customer_address" alter column "address_1" type text using ("address_1"::text);`);
    this.addSql(`alter table "customer_address" alter column "address_1" drop not null;`);
    this.addSql(`alter table "customer_address" alter column "address_2" type text using ("address_2"::text);`);
    this.addSql(`alter table "customer_address" alter column "city" type text using ("city"::text);`);
    this.addSql(`alter table "customer_address" alter column "city" drop not null;`);
    this.addSql(`alter table "customer_address" alter column "country_code" type text using ("country_code"::text);`);
    this.addSql(`alter table "customer_address" alter column "country_code" drop not null;`);
    this.addSql(`alter table "customer_address" alter column "province" type text using ("province"::text);`);
    this.addSql(`alter table "customer_address" alter column "postal_code" type text using ("postal_code"::text);`);
    this.addSql(`alter table "customer_address" alter column "postal_code" drop not null;`);
    this.addSql(`alter table "customer_address" alter column "phone" type text using ("phone"::text);`);
    this.addSql(`alter table "customer_address" add constraint "customer_address_customer_id_foreign" foreign key ("customer_id") references "customer" ("id") on update cascade on delete cascade;`);
    this.addSql(`create index "IDX_customer_address_customer_id" on "customer_address" ("customer_id");`);
    this.addSql(`CREATE INDEX "IDX_customer_address_deleted_at" ON public.customer_address USING btree (deleted_at) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_customer_address_unique_customer_billing" ON public.customer_address USING btree (customer_id) WHERE (is_default_billing = true);`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_customer_address_unique_customer_shipping" ON public.customer_address USING btree (customer_id) WHERE (is_default_shipping = true);`);

    this.addSql(`alter table "otp" alter column "id" drop default;`);
    this.addSql(`alter table "otp" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "otp" alter column "otp" type varchar(10) using ("otp"::varchar(10));`);
    this.addSql(`alter table "otp" alter column "created_at" type timestamp(6) using ("created_at"::timestamp(6));`);
    this.addSql(`alter table "otp" alter column "created_at" set default CURRENT_TIMESTAMP;`);

    this.addSql(`alter table "product" alter column "id" type text using ("id"::text);`);
    this.addSql(`alter table "product" alter column "title" type text using ("title"::text);`);
    this.addSql(`alter table "product" alter column "subtitle" type text using ("subtitle"::text);`);
    this.addSql(`alter table "product" alter column "description" type text using ("description"::text);`);
    this.addSql(`alter table "product" alter column "handle" type text using ("handle"::text);`);
    this.addSql(`alter table "product" alter column "status" type text using ("status"::text);`);
    this.addSql(`alter table "product" alter column "thumbnail" type text using ("thumbnail"::text);`);
    this.addSql(`alter table "product" alter column "weight" type text using ("weight"::text);`);
    this.addSql(`alter table "product" alter column "length" type text using ("length"::text);`);
    this.addSql(`alter table "product" alter column "height" type text using ("height"::text);`);
    this.addSql(`alter table "product" alter column "width" type text using ("width"::text);`);
    this.addSql(`alter table "product" alter column "origin_country" type text using ("origin_country"::text);`);
    this.addSql(`alter table "product" alter column "hs_code" type text using ("hs_code"::text);`);
    this.addSql(`alter table "product" alter column "mid_code" type text using ("mid_code"::text);`);
    this.addSql(`alter table "product" alter column "material" type text using ("material"::text);`);
    this.addSql(`alter table "product" alter column "collection_id" type text using ("collection_id"::text);`);
    this.addSql(`alter table "product" alter column "type_id" type text using ("type_id"::text);`);
    this.addSql(`alter table "product" alter column "external_id" type text using ("external_id"::text);`);
    this.addSql(`alter table "product" alter column "created_at" type timestamptz(6) using ("created_at"::timestamptz(6));`);
    this.addSql(`alter table "product" alter column "created_at" set default now();`);
    this.addSql(`alter table "product" alter column "updated_at" type timestamptz(6) using ("updated_at"::timestamptz(6));`);
    this.addSql(`alter table "product" alter column "updated_at" set default now();`);
    this.addSql(`alter table "product" add constraint "product_status_check" check("status" in ('draft', 'proposed', 'published', 'rejected'));`);
    this.addSql(`alter table "product" add constraint "product_collection_id_foreign" foreign key ("collection_id") references "product_collection" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "product" add constraint "product_type_id_foreign" foreign key ("type_id") references "product_type" ("id") on update cascade on delete set null;`);
    this.addSql(`CREATE INDEX "IDX_product_collection_id" ON public.product USING btree (collection_id) WHERE (deleted_at IS NULL);`);
    this.addSql(`create index "IDX_product_deleted_at" on "product" ("deleted_at");`);
    this.addSql(`CREATE UNIQUE INDEX "IDX_product_handle_unique" ON public.product USING btree (handle) WHERE (deleted_at IS NULL);`);
    this.addSql(`CREATE INDEX "IDX_product_type_id" ON public.product USING btree (type_id) WHERE (deleted_at IS NULL);`);
  }

}
