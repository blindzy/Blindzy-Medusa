-- 1. Create the database
CREATE DATABASE medusa_db;

-- 2. Create a dedicated user
CREATE USER medusa_user WITH PASSWORD 'admin123';

-- 3. Grant privileges
GRANT ALL PRIVILEGES ON DATABASE medusa_db TO medusa_user;

-- Connect to your Medusa DB
\c medusa_db

-- Grant usage + create privileges on public schema
GRANT USAGE ON SCHEMA public TO medusa_user;
GRANT CREATE ON SCHEMA public TO medusa_user;

-- Also grant full access on all current and future tables (just in case)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO medusa_user;

GRANT CONNECT ON DATABASE medusa_db TO medusa_user;

-- Create Types

CREATE TYPE order_status_enum AS ENUM (
    'pending',
    'completed',
    'canceled',
    'requires_action',
    'partially_shipped',
    'shipped',
    'partially_returned',
    'returned',
    'awaiting',
    'draft'
);

CREATE TYPE order_claim_type_enum AS ENUM ('refund', 'replace', 'partial_refund');

CREATE TYPE claim_reason_enum AS ENUM (
    'missing_item',
    'damaged_item',
    'wrong_item',
    'other'
);


CREATE TYPE return_status_enum AS ENUM (
    'open',
    'requested',
    'received',
    'requires_action',
    'canceled',
    'completed'
);




--------------------------------------------------------------
-- Run Erd Script
--------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.account_holder
(
    id text COLLATE pg_catalog."default" NOT NULL,
    provider_id text COLLATE pg_catalog."default" NOT NULL,
    external_id text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default",
    data jsonb NOT NULL DEFAULT '{}'::jsonb,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT account_holder_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.api_key
(
    id text COLLATE pg_catalog."default" NOT NULL,
    token text COLLATE pg_catalog."default" NOT NULL,
    salt text COLLATE pg_catalog."default" NOT NULL,
    redacted text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    last_used_at timestamp with time zone,
    created_by text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    revoked_by text COLLATE pg_catalog."default",
    revoked_at timestamp with time zone,
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT api_key_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.application_method_buy_rules
(
    application_method_id text COLLATE pg_catalog."default" NOT NULL,
    promotion_rule_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT application_method_buy_rules_pkey PRIMARY KEY (application_method_id, promotion_rule_id)
);

CREATE TABLE IF NOT EXISTS public.application_method_target_rules
(
    application_method_id text COLLATE pg_catalog."default" NOT NULL,
    promotion_rule_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT application_method_target_rules_pkey PRIMARY KEY (application_method_id, promotion_rule_id)
);

CREATE TABLE IF NOT EXISTS public.auth_identity
(
    id text COLLATE pg_catalog."default" NOT NULL,
    app_metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT auth_identity_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.capture
(
    id text COLLATE pg_catalog."default" NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    payment_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    created_by text COLLATE pg_catalog."default",
    metadata jsonb,
    CONSTRAINT capture_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.cart
(
    id text COLLATE pg_catalog."default" NOT NULL,
    region_id text COLLATE pg_catalog."default",
    customer_id text COLLATE pg_catalog."default",
    sales_channel_id text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    currency_code text COLLATE pg_catalog."default" NOT NULL,
    shipping_address_id text COLLATE pg_catalog."default",
    billing_address_id text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    completed_at timestamp with time zone,
    CONSTRAINT cart_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.cart_address
(
    id text COLLATE pg_catalog."default" NOT NULL,
    customer_id text COLLATE pg_catalog."default",
    company text COLLATE pg_catalog."default",
    first_name text COLLATE pg_catalog."default",
    last_name text COLLATE pg_catalog."default",
    address_1 text COLLATE pg_catalog."default",
    address_2 text COLLATE pg_catalog."default",
    city text COLLATE pg_catalog."default",
    country_code text COLLATE pg_catalog."default",
    province text COLLATE pg_catalog."default",
    postal_code text COLLATE pg_catalog."default",
    phone text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT cart_address_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.cart_line_item
(
    id text COLLATE pg_catalog."default" NOT NULL,
    cart_id text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    subtitle text COLLATE pg_catalog."default",
    thumbnail text COLLATE pg_catalog."default",
    quantity integer NOT NULL,
    variant_id text COLLATE pg_catalog."default",
    product_id text COLLATE pg_catalog."default",
    product_title text COLLATE pg_catalog."default",
    product_description text COLLATE pg_catalog."default",
    product_subtitle text COLLATE pg_catalog."default",
    product_type text COLLATE pg_catalog."default",
    product_collection text COLLATE pg_catalog."default",
    product_handle text COLLATE pg_catalog."default",
    variant_sku text COLLATE pg_catalog."default",
    variant_barcode text COLLATE pg_catalog."default",
    variant_title text COLLATE pg_catalog."default",
    variant_option_values jsonb,
    requires_shipping boolean NOT NULL DEFAULT true,
    is_discountable boolean NOT NULL DEFAULT true,
    is_tax_inclusive boolean NOT NULL DEFAULT false,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb,
    unit_price numeric NOT NULL,
    raw_unit_price jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    product_type_id text COLLATE pg_catalog."default",
    is_custom_price boolean NOT NULL DEFAULT false,
    is_giftcard boolean NOT NULL DEFAULT false,
    CONSTRAINT cart_line_item_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.cart_line_item_adjustment
(
    id text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    promotion_id text COLLATE pg_catalog."default",
    code text COLLATE pg_catalog."default",
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    item_id text COLLATE pg_catalog."default",
    is_tax_inclusive boolean NOT NULL DEFAULT false,
    CONSTRAINT cart_line_item_adjustment_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.cart_line_item_tax_line
(
    id text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    tax_rate_id text COLLATE pg_catalog."default",
    code text COLLATE pg_catalog."default" NOT NULL,
    rate real NOT NULL,
    provider_id text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    item_id text COLLATE pg_catalog."default",
    CONSTRAINT cart_line_item_tax_line_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.cart_payment_collection
(
    cart_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    payment_collection_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT cart_payment_collection_pkey PRIMARY KEY (cart_id, payment_collection_id)
);

CREATE TABLE IF NOT EXISTS public.cart_promotion
(
    cart_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    promotion_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT cart_promotion_pkey PRIMARY KEY (cart_id, promotion_id)
);

CREATE TABLE IF NOT EXISTS public.cart_shipping_method
(
    id text COLLATE pg_catalog."default" NOT NULL,
    cart_id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    description jsonb,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    is_tax_inclusive boolean NOT NULL DEFAULT false,
    shipping_option_id text COLLATE pg_catalog."default",
    data jsonb,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT cart_shipping_method_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.cart_shipping_method_adjustment
(
    id text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    promotion_id text COLLATE pg_catalog."default",
    code text COLLATE pg_catalog."default",
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    shipping_method_id text COLLATE pg_catalog."default",
    CONSTRAINT cart_shipping_method_adjustment_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.cart_shipping_method_tax_line
(
    id text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    tax_rate_id text COLLATE pg_catalog."default",
    code text COLLATE pg_catalog."default" NOT NULL,
    rate real NOT NULL,
    provider_id text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    shipping_method_id text COLLATE pg_catalog."default",
    CONSTRAINT cart_shipping_method_tax_line_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.credit_line
(
    id text COLLATE pg_catalog."default" NOT NULL,
    cart_id text COLLATE pg_catalog."default" NOT NULL,
    reference text COLLATE pg_catalog."default",
    reference_id text COLLATE pg_catalog."default",
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT credit_line_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.currency
(
    code text COLLATE pg_catalog."default" NOT NULL,
    symbol text COLLATE pg_catalog."default" NOT NULL,
    symbol_native text COLLATE pg_catalog."default" NOT NULL,
    decimal_digits integer NOT NULL DEFAULT 0,
    rounding numeric NOT NULL DEFAULT 0,
    raw_rounding jsonb NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT currency_pkey PRIMARY KEY (code)
);

CREATE TABLE IF NOT EXISTS public.customer
(
    id text COLLATE pg_catalog."default" NOT NULL,
    company_name text COLLATE pg_catalog."default",
    first_name text COLLATE pg_catalog."default",
    last_name text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    phone text COLLATE pg_catalog."default",
    has_account boolean NOT NULL DEFAULT false,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    created_by text COLLATE pg_catalog."default",
    username character varying COLLATE pg_catalog."default",
    password_hash text COLLATE pg_catalog."default",
    CONSTRAINT customer_pkey PRIMARY KEY (id),
    CONSTRAINT customer_username_key UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS public.customer_account_holder
(
    customer_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    account_holder_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT customer_account_holder_pkey PRIMARY KEY (customer_id, account_holder_id)
);

CREATE TABLE IF NOT EXISTS public.customer_address
(
    id text COLLATE pg_catalog."default" NOT NULL,
    customer_id text COLLATE pg_catalog."default" NOT NULL,
    address_name text COLLATE pg_catalog."default",
    is_default_shipping boolean NOT NULL DEFAULT false,
    is_default_billing boolean NOT NULL DEFAULT false,
    company text COLLATE pg_catalog."default",
    first_name text COLLATE pg_catalog."default",
    last_name text COLLATE pg_catalog."default",
    address_1 text COLLATE pg_catalog."default",
    address_2 text COLLATE pg_catalog."default",
    city text COLLATE pg_catalog."default",
    country_code text COLLATE pg_catalog."default",
    province text COLLATE pg_catalog."default",
    postal_code text COLLATE pg_catalog."default",
    phone text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT customer_address_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.customer_group
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    created_by text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT customer_group_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.customer_group_customer
(
    id text COLLATE pg_catalog."default" NOT NULL,
    customer_id text COLLATE pg_catalog."default" NOT NULL,
    customer_group_id text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    created_by text COLLATE pg_catalog."default",
    deleted_at timestamp with time zone,
    CONSTRAINT customer_group_customer_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.fulfillment
(
    id text COLLATE pg_catalog."default" NOT NULL,
    location_id text COLLATE pg_catalog."default" NOT NULL,
    packed_at timestamp with time zone,
    shipped_at timestamp with time zone,
    delivered_at timestamp with time zone,
    canceled_at timestamp with time zone,
    data jsonb,
    provider_id text COLLATE pg_catalog."default",
    shipping_option_id text COLLATE pg_catalog."default",
    metadata jsonb,
    delivery_address_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    marked_shipped_by text COLLATE pg_catalog."default",
    created_by text COLLATE pg_catalog."default",
    requires_shipping boolean NOT NULL DEFAULT true,
    CONSTRAINT fulfillment_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.fulfillment_address
(
    id text COLLATE pg_catalog."default" NOT NULL,
    company text COLLATE pg_catalog."default",
    first_name text COLLATE pg_catalog."default",
    last_name text COLLATE pg_catalog."default",
    address_1 text COLLATE pg_catalog."default",
    address_2 text COLLATE pg_catalog."default",
    city text COLLATE pg_catalog."default",
    country_code text COLLATE pg_catalog."default",
    province text COLLATE pg_catalog."default",
    postal_code text COLLATE pg_catalog."default",
    phone text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT fulfillment_address_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.fulfillment_item
(
    id text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    sku text COLLATE pg_catalog."default" NOT NULL,
    barcode text COLLATE pg_catalog."default" NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    line_item_id text COLLATE pg_catalog."default",
    inventory_item_id text COLLATE pg_catalog."default",
    fulfillment_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT fulfillment_item_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.fulfillment_label
(
    id text COLLATE pg_catalog."default" NOT NULL,
    tracking_number text COLLATE pg_catalog."default" NOT NULL,
    tracking_url text COLLATE pg_catalog."default" NOT NULL,
    label_url text COLLATE pg_catalog."default" NOT NULL,
    fulfillment_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT fulfillment_label_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.fulfillment_provider
(
    id text COLLATE pg_catalog."default" NOT NULL,
    is_enabled boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT fulfillment_provider_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.fulfillment_set
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT fulfillment_set_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.geo_zone
(
    id text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL DEFAULT 'country'::text,
    country_code text COLLATE pg_catalog."default" NOT NULL,
    province_code text COLLATE pg_catalog."default",
    city text COLLATE pg_catalog."default",
    service_zone_id text COLLATE pg_catalog."default" NOT NULL,
    postal_expression jsonb,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT geo_zone_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.image
(
    id text COLLATE pg_catalog."default" NOT NULL,
    url text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    rank integer NOT NULL DEFAULT 0,
    product_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT image_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.inventory_item
(
    id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    sku text COLLATE pg_catalog."default",
    origin_country text COLLATE pg_catalog."default",
    hs_code text COLLATE pg_catalog."default",
    mid_code text COLLATE pg_catalog."default",
    material text COLLATE pg_catalog."default",
    weight integer,
    length integer,
    height integer,
    width integer,
    requires_shipping boolean NOT NULL DEFAULT true,
    description text COLLATE pg_catalog."default",
    title text COLLATE pg_catalog."default",
    thumbnail text COLLATE pg_catalog."default",
    metadata jsonb,
    CONSTRAINT inventory_item_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.inventory_level
(
    id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    inventory_item_id text COLLATE pg_catalog."default" NOT NULL,
    location_id text COLLATE pg_catalog."default" NOT NULL,
    stocked_quantity numeric NOT NULL DEFAULT 0,
    reserved_quantity numeric NOT NULL DEFAULT 0,
    incoming_quantity numeric NOT NULL DEFAULT 0,
    metadata jsonb,
    raw_stocked_quantity jsonb,
    raw_reserved_quantity jsonb,
    raw_incoming_quantity jsonb,
    CONSTRAINT inventory_level_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.invite
(
    id text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    accepted boolean NOT NULL DEFAULT false,
    token text COLLATE pg_catalog."default" NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT invite_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.link_module_migrations
(
    id serial NOT NULL,
    table_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    link_descriptor jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT link_module_migrations_pkey PRIMARY KEY (id),
    CONSTRAINT link_module_migrations_table_name_key UNIQUE (table_name)
);

CREATE TABLE IF NOT EXISTS public.location_fulfillment_provider
(
    stock_location_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    fulfillment_provider_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT location_fulfillment_provider_pkey PRIMARY KEY (stock_location_id, fulfillment_provider_id)
);

CREATE TABLE IF NOT EXISTS public.location_fulfillment_set
(
    stock_location_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    fulfillment_set_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT location_fulfillment_set_pkey PRIMARY KEY (stock_location_id, fulfillment_set_id)
);

CREATE TABLE IF NOT EXISTS public.mikro_orm_migrations
(
    id serial NOT NULL,
    name character varying(255) COLLATE pg_catalog."default",
    executed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.notification
(
    id text COLLATE pg_catalog."default" NOT NULL,
    "to" text COLLATE pg_catalog."default" NOT NULL,
    channel text COLLATE pg_catalog."default" NOT NULL,
    template text COLLATE pg_catalog."default" NOT NULL,
    data jsonb,
    trigger_type text COLLATE pg_catalog."default",
    resource_id text COLLATE pg_catalog."default",
    resource_type text COLLATE pg_catalog."default",
    receiver_id text COLLATE pg_catalog."default",
    original_notification_id text COLLATE pg_catalog."default",
    idempotency_key text COLLATE pg_catalog."default",
    external_id text COLLATE pg_catalog."default",
    provider_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    status text COLLATE pg_catalog."default" NOT NULL DEFAULT 'pending'::text,
    CONSTRAINT notification_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.notification_provider
(
    id text COLLATE pg_catalog."default" NOT NULL,
    handle text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    is_enabled boolean NOT NULL DEFAULT true,
    channels text[] COLLATE pg_catalog."default" NOT NULL DEFAULT '{}'::text[],
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT notification_provider_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."order"
(
    id text COLLATE pg_catalog."default" NOT NULL,
    region_id text COLLATE pg_catalog."default",
    display_id serial,
    customer_id text COLLATE pg_catalog."default",
    version integer NOT NULL DEFAULT 1,
    sales_channel_id text COLLATE pg_catalog."default",
    status order_status_enum NOT NULL DEFAULT 'pending'::order_status_enum,
    is_draft_order boolean NOT NULL DEFAULT false,
    email text COLLATE pg_catalog."default",
    currency_code text COLLATE pg_catalog."default" NOT NULL,
    shipping_address_id text COLLATE pg_catalog."default",
    billing_address_id text COLLATE pg_catalog."default",
    no_notification boolean,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    CONSTRAINT order_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_address
(
    id text COLLATE pg_catalog."default" NOT NULL,
    customer_id text COLLATE pg_catalog."default",
    company text COLLATE pg_catalog."default",
    first_name text COLLATE pg_catalog."default",
    last_name text COLLATE pg_catalog."default",
    address_1 text COLLATE pg_catalog."default",
    address_2 text COLLATE pg_catalog."default",
    city text COLLATE pg_catalog."default",
    country_code text COLLATE pg_catalog."default",
    province text COLLATE pg_catalog."default",
    postal_code text COLLATE pg_catalog."default",
    phone text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT order_address_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_cart
(
    order_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    cart_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT order_cart_pkey PRIMARY KEY (order_id, cart_id)
);

CREATE TABLE IF NOT EXISTS public.order_change
(
    id text COLLATE pg_catalog."default" NOT NULL,
    order_id text COLLATE pg_catalog."default" NOT NULL,
    version integer NOT NULL,
    description text COLLATE pg_catalog."default",
    status text COLLATE pg_catalog."default" NOT NULL DEFAULT 'pending'::text,
    internal_note text COLLATE pg_catalog."default",
    created_by text COLLATE pg_catalog."default",
    requested_by text COLLATE pg_catalog."default",
    requested_at timestamp with time zone,
    confirmed_by text COLLATE pg_catalog."default",
    confirmed_at timestamp with time zone,
    declined_by text COLLATE pg_catalog."default",
    declined_reason text COLLATE pg_catalog."default",
    metadata jsonb,
    declined_at timestamp with time zone,
    canceled_by text COLLATE pg_catalog."default",
    canceled_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    change_type text COLLATE pg_catalog."default",
    deleted_at timestamp with time zone,
    return_id text COLLATE pg_catalog."default",
    claim_id text COLLATE pg_catalog."default",
    exchange_id text COLLATE pg_catalog."default",
    CONSTRAINT order_change_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_change_action
(
    id text COLLATE pg_catalog."default" NOT NULL,
    order_id text COLLATE pg_catalog."default",
    version integer,
    ordering bigserial NOT NULL,
    order_change_id text COLLATE pg_catalog."default",
    reference text COLLATE pg_catalog."default",
    reference_id text COLLATE pg_catalog."default",
    action text COLLATE pg_catalog."default" NOT NULL,
    details jsonb,
    amount numeric,
    raw_amount jsonb,
    internal_note text COLLATE pg_catalog."default",
    applied boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    return_id text COLLATE pg_catalog."default",
    claim_id text COLLATE pg_catalog."default",
    exchange_id text COLLATE pg_catalog."default",
    CONSTRAINT order_change_action_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_claim
(
    id text COLLATE pg_catalog."default" NOT NULL,
    order_id text COLLATE pg_catalog."default" NOT NULL,
    return_id text COLLATE pg_catalog."default",
    order_version integer NOT NULL,
    display_id serial NOT NULL,
    type order_claim_type_enum NOT NULL,
    no_notification boolean,
    refund_amount numeric,
    raw_refund_amount jsonb,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    created_by text COLLATE pg_catalog."default",
    CONSTRAINT order_claim_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_claim_item
(
    id text COLLATE pg_catalog."default" NOT NULL,
    claim_id text COLLATE pg_catalog."default" NOT NULL,
    item_id text COLLATE pg_catalog."default" NOT NULL,
    is_additional_item boolean NOT NULL DEFAULT false,
    reason claim_reason_enum,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    note text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT order_claim_item_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_claim_item_image
(
    id text COLLATE pg_catalog."default" NOT NULL,
    claim_item_id text COLLATE pg_catalog."default" NOT NULL,
    url text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT order_claim_item_image_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_credit_line
(
    id text COLLATE pg_catalog."default" NOT NULL,
    order_id text COLLATE pg_catalog."default" NOT NULL,
    reference text COLLATE pg_catalog."default",
    reference_id text COLLATE pg_catalog."default",
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT order_credit_line_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_exchange
(
    id text COLLATE pg_catalog."default" NOT NULL,
    order_id text COLLATE pg_catalog."default" NOT NULL,
    return_id text COLLATE pg_catalog."default",
    order_version integer NOT NULL,
    display_id serial NOT NULL,
    no_notification boolean,
    allow_backorder boolean NOT NULL DEFAULT false,
    difference_due numeric,
    raw_difference_due jsonb,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    created_by text COLLATE pg_catalog."default",
    CONSTRAINT order_exchange_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_exchange_item
(
    id text COLLATE pg_catalog."default" NOT NULL,
    exchange_id text COLLATE pg_catalog."default" NOT NULL,
    item_id text COLLATE pg_catalog."default" NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    note text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT order_exchange_item_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_fulfillment
(
    order_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    fulfillment_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT order_fulfillment_pkey PRIMARY KEY (order_id, fulfillment_id)
);

CREATE TABLE IF NOT EXISTS public.order_item
(
    id text COLLATE pg_catalog."default" NOT NULL,
    order_id text COLLATE pg_catalog."default" NOT NULL,
    version integer NOT NULL,
    item_id text COLLATE pg_catalog."default" NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    fulfilled_quantity numeric NOT NULL,
    raw_fulfilled_quantity jsonb NOT NULL,
    shipped_quantity numeric NOT NULL,
    raw_shipped_quantity jsonb NOT NULL,
    return_requested_quantity numeric NOT NULL,
    raw_return_requested_quantity jsonb NOT NULL,
    return_received_quantity numeric NOT NULL,
    raw_return_received_quantity jsonb NOT NULL,
    return_dismissed_quantity numeric NOT NULL,
    raw_return_dismissed_quantity jsonb NOT NULL,
    written_off_quantity numeric NOT NULL,
    raw_written_off_quantity jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    delivered_quantity numeric NOT NULL DEFAULT 0,
    raw_delivered_quantity jsonb NOT NULL,
    unit_price numeric,
    raw_unit_price jsonb,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb,
    CONSTRAINT order_item_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_line_item
(
    id text COLLATE pg_catalog."default" NOT NULL,
    totals_id text COLLATE pg_catalog."default",
    title text COLLATE pg_catalog."default" NOT NULL,
    subtitle text COLLATE pg_catalog."default",
    thumbnail text COLLATE pg_catalog."default",
    variant_id text COLLATE pg_catalog."default",
    product_id text COLLATE pg_catalog."default",
    product_title text COLLATE pg_catalog."default",
    product_description text COLLATE pg_catalog."default",
    product_subtitle text COLLATE pg_catalog."default",
    product_type text COLLATE pg_catalog."default",
    product_collection text COLLATE pg_catalog."default",
    product_handle text COLLATE pg_catalog."default",
    variant_sku text COLLATE pg_catalog."default",
    variant_barcode text COLLATE pg_catalog."default",
    variant_title text COLLATE pg_catalog."default",
    variant_option_values jsonb,
    requires_shipping boolean NOT NULL DEFAULT true,
    is_discountable boolean NOT NULL DEFAULT true,
    is_tax_inclusive boolean NOT NULL DEFAULT false,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb,
    unit_price numeric NOT NULL,
    raw_unit_price jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    is_custom_price boolean NOT NULL DEFAULT false,
    product_type_id text COLLATE pg_catalog."default",
    is_giftcard boolean NOT NULL DEFAULT false,
    CONSTRAINT order_line_item_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_line_item_adjustment
(
    id text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    promotion_id text COLLATE pg_catalog."default",
    code text COLLATE pg_catalog."default",
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    item_id text COLLATE pg_catalog."default" NOT NULL,
    deleted_at timestamp with time zone,
    is_tax_inclusive boolean NOT NULL DEFAULT false,
    CONSTRAINT order_line_item_adjustment_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_line_item_tax_line
(
    id text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    tax_rate_id text COLLATE pg_catalog."default",
    code text COLLATE pg_catalog."default" NOT NULL,
    rate numeric NOT NULL,
    raw_rate jsonb NOT NULL,
    provider_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    item_id text COLLATE pg_catalog."default" NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT order_line_item_tax_line_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_payment_collection
(
    order_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    payment_collection_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT order_payment_collection_pkey PRIMARY KEY (order_id, payment_collection_id)
);

CREATE TABLE IF NOT EXISTS public.order_promotion
(
    order_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    promotion_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT order_promotion_pkey PRIMARY KEY (order_id, promotion_id)
);

CREATE TABLE IF NOT EXISTS public.order_shipping
(
    id text COLLATE pg_catalog."default" NOT NULL,
    order_id text COLLATE pg_catalog."default" NOT NULL,
    version integer NOT NULL,
    shipping_method_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    return_id text COLLATE pg_catalog."default",
    claim_id text COLLATE pg_catalog."default",
    exchange_id text COLLATE pg_catalog."default",
    CONSTRAINT order_shipping_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_shipping_method
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    description jsonb,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    is_tax_inclusive boolean NOT NULL DEFAULT false,
    shipping_option_id text COLLATE pg_catalog."default",
    data jsonb,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    is_custom_amount boolean NOT NULL DEFAULT false,
    CONSTRAINT order_shipping_method_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_shipping_method_adjustment
(
    id text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    promotion_id text COLLATE pg_catalog."default",
    code text COLLATE pg_catalog."default",
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    shipping_method_id text COLLATE pg_catalog."default" NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT order_shipping_method_adjustment_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_shipping_method_tax_line
(
    id text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    tax_rate_id text COLLATE pg_catalog."default",
    code text COLLATE pg_catalog."default" NOT NULL,
    rate numeric NOT NULL,
    raw_rate jsonb NOT NULL,
    provider_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    shipping_method_id text COLLATE pg_catalog."default" NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT order_shipping_method_tax_line_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_summary
(
    id text COLLATE pg_catalog."default" NOT NULL,
    order_id text COLLATE pg_catalog."default" NOT NULL,
    version integer NOT NULL DEFAULT 1,
    totals jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT order_summary_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.order_transaction
(
    id text COLLATE pg_catalog."default" NOT NULL,
    order_id text COLLATE pg_catalog."default" NOT NULL,
    version integer NOT NULL DEFAULT 1,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    currency_code text COLLATE pg_catalog."default" NOT NULL,
    reference text COLLATE pg_catalog."default",
    reference_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    return_id text COLLATE pg_catalog."default",
    claim_id text COLLATE pg_catalog."default",
    exchange_id text COLLATE pg_catalog."default",
    CONSTRAINT order_transaction_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.otp
(
    id uuid NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    otp character varying(10) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT otp_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.payment
(
    id text COLLATE pg_catalog."default" NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    currency_code text COLLATE pg_catalog."default" NOT NULL,
    provider_id text COLLATE pg_catalog."default" NOT NULL,
    data jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    captured_at timestamp with time zone,
    canceled_at timestamp with time zone,
    payment_collection_id text COLLATE pg_catalog."default" NOT NULL,
    payment_session_id text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    CONSTRAINT payment_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.payment_collection
(
    id text COLLATE pg_catalog."default" NOT NULL,
    currency_code text COLLATE pg_catalog."default" NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    authorized_amount numeric,
    raw_authorized_amount jsonb,
    captured_amount numeric,
    raw_captured_amount jsonb,
    refunded_amount numeric,
    raw_refunded_amount jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    completed_at timestamp with time zone,
    status text COLLATE pg_catalog."default" NOT NULL DEFAULT 'not_paid'::text,
    metadata jsonb,
    CONSTRAINT payment_collection_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.payment_collection_payment_providers
(
    payment_collection_id text COLLATE pg_catalog."default" NOT NULL,
    payment_provider_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT payment_collection_payment_providers_pkey PRIMARY KEY (payment_collection_id, payment_provider_id)
);

CREATE TABLE IF NOT EXISTS public.payment_provider
(
    id text COLLATE pg_catalog."default" NOT NULL,
    is_enabled boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT payment_provider_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.payment_session
(
    id text COLLATE pg_catalog."default" NOT NULL,
    currency_code text COLLATE pg_catalog."default" NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text COLLATE pg_catalog."default" NOT NULL,
    data jsonb NOT NULL DEFAULT '{}'::jsonb,
    context jsonb,
    status text COLLATE pg_catalog."default" NOT NULL DEFAULT 'pending'::text,
    authorized_at timestamp with time zone,
    payment_collection_id text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT payment_session_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.price
(
    id text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default",
    price_set_id text COLLATE pg_catalog."default" NOT NULL,
    currency_code text COLLATE pg_catalog."default" NOT NULL,
    raw_amount jsonb NOT NULL,
    rules_count integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    price_list_id text COLLATE pg_catalog."default",
    amount numeric NOT NULL,
    min_quantity integer,
    max_quantity integer,
    CONSTRAINT price_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.price_list
(
    id text COLLATE pg_catalog."default" NOT NULL,
    status text COLLATE pg_catalog."default" NOT NULL DEFAULT 'draft'::text,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    rules_count integer DEFAULT 0,
    title text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL DEFAULT 'sale'::text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT price_list_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.price_list_rule
(
    id text COLLATE pg_catalog."default" NOT NULL,
    price_list_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    value jsonb,
    attribute text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    CONSTRAINT price_list_rule_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.price_preference
(
    id text COLLATE pg_catalog."default" NOT NULL,
    attribute text COLLATE pg_catalog."default" NOT NULL,
    value text COLLATE pg_catalog."default",
    is_tax_inclusive boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT price_preference_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.price_rule
(
    id text COLLATE pg_catalog."default" NOT NULL,
    value text COLLATE pg_catalog."default" NOT NULL,
    priority integer NOT NULL DEFAULT 0,
    price_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    attribute text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    operator text COLLATE pg_catalog."default" NOT NULL DEFAULT 'eq'::text,
    CONSTRAINT price_rule_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.price_set
(
    id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT price_set_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.product
(
    id text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    handle text COLLATE pg_catalog."default" NOT NULL,
    subtitle text COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    is_giftcard boolean NOT NULL DEFAULT false,
    status text COLLATE pg_catalog."default" NOT NULL DEFAULT 'draft'::text,
    thumbnail text COLLATE pg_catalog."default",
    weight text COLLATE pg_catalog."default",
    length text COLLATE pg_catalog."default",
    height text COLLATE pg_catalog."default",
    width text COLLATE pg_catalog."default",
    origin_country text COLLATE pg_catalog."default",
    hs_code text COLLATE pg_catalog."default",
    mid_code text COLLATE pg_catalog."default",
    material text COLLATE pg_catalog."default",
    collection_id text COLLATE pg_catalog."default",
    type_id text COLLATE pg_catalog."default",
    discountable boolean NOT NULL DEFAULT true,
    external_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    metadata jsonb,
    CONSTRAINT product_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.product_category
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    handle text COLLATE pg_catalog."default" NOT NULL,
    mpath text COLLATE pg_catalog."default" NOT NULL,
    is_active boolean NOT NULL DEFAULT false,
    is_internal boolean NOT NULL DEFAULT false,
    rank integer NOT NULL DEFAULT 0,
    parent_category_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    metadata jsonb,
    CONSTRAINT product_category_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.product_category_product
(
    product_id text COLLATE pg_catalog."default" NOT NULL,
    product_category_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT product_category_product_pkey PRIMARY KEY (product_id, product_category_id)
);

CREATE TABLE IF NOT EXISTS public.product_collection
(
    id text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    handle text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT product_collection_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.product_option
(
    id text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    product_id text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT product_option_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.product_option_value
(
    id text COLLATE pg_catalog."default" NOT NULL,
    value text COLLATE pg_catalog."default" NOT NULL,
    option_id text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT product_option_value_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.product_sales_channel
(
    product_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    sales_channel_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT product_sales_channel_pkey PRIMARY KEY (product_id, sales_channel_id)
);

CREATE TABLE IF NOT EXISTS public.product_shipping_profile
(
    product_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    shipping_profile_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT product_shipping_profile_pkey PRIMARY KEY (product_id, shipping_profile_id)
);

CREATE TABLE IF NOT EXISTS public.product_tag
(
    id text COLLATE pg_catalog."default" NOT NULL,
    value text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT product_tag_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.product_tags
(
    product_id text COLLATE pg_catalog."default" NOT NULL,
    product_tag_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT product_tags_pkey PRIMARY KEY (product_id, product_tag_id)
);

CREATE TABLE IF NOT EXISTS public.product_type
(
    id text COLLATE pg_catalog."default" NOT NULL,
    value text COLLATE pg_catalog."default" NOT NULL,
    metadata json,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT product_type_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.product_variant
(
    id text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    sku text COLLATE pg_catalog."default",
    barcode text COLLATE pg_catalog."default",
    ean text COLLATE pg_catalog."default",
    upc text COLLATE pg_catalog."default",
    allow_backorder boolean NOT NULL DEFAULT false,
    manage_inventory boolean NOT NULL DEFAULT true,
    hs_code text COLLATE pg_catalog."default",
    origin_country text COLLATE pg_catalog."default",
    mid_code text COLLATE pg_catalog."default",
    material text COLLATE pg_catalog."default",
    weight integer,
    length integer,
    height integer,
    width integer,
    metadata jsonb,
    variant_rank integer DEFAULT 0,
    product_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT product_variant_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.product_variant_inventory_item
(
    variant_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    inventory_item_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    required_quantity integer NOT NULL DEFAULT 1,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT product_variant_inventory_item_pkey PRIMARY KEY (variant_id, inventory_item_id)
);

CREATE TABLE IF NOT EXISTS public.product_variant_option
(
    variant_id text COLLATE pg_catalog."default" NOT NULL,
    option_value_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT product_variant_option_pkey PRIMARY KEY (variant_id, option_value_id)
);

CREATE TABLE IF NOT EXISTS public.product_variant_price_set
(
    variant_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    price_set_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT product_variant_price_set_pkey PRIMARY KEY (variant_id, price_set_id)
);

CREATE TABLE IF NOT EXISTS public.promotion
(
    id text COLLATE pg_catalog."default" NOT NULL,
    code text COLLATE pg_catalog."default" NOT NULL,
    campaign_id text COLLATE pg_catalog."default",
    is_automatic boolean NOT NULL DEFAULT false,
    type text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    status text COLLATE pg_catalog."default" NOT NULL DEFAULT 'draft'::text,
    is_tax_inclusive boolean NOT NULL DEFAULT false,
    CONSTRAINT promotion_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.promotion_application_method
(
    id text COLLATE pg_catalog."default" NOT NULL,
    value numeric,
    raw_value jsonb,
    max_quantity integer,
    apply_to_quantity integer,
    buy_rules_min_quantity integer,
    type text COLLATE pg_catalog."default" NOT NULL,
    target_type text COLLATE pg_catalog."default" NOT NULL,
    allocation text COLLATE pg_catalog."default",
    promotion_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    currency_code text COLLATE pg_catalog."default",
    CONSTRAINT promotion_application_method_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.promotion_campaign
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    campaign_identifier text COLLATE pg_catalog."default" NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT promotion_campaign_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.promotion_campaign_budget
(
    id text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    campaign_id text COLLATE pg_catalog."default" NOT NULL,
    "limit" numeric,
    raw_limit jsonb,
    used numeric NOT NULL DEFAULT 0,
    raw_used jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    currency_code text COLLATE pg_catalog."default",
    CONSTRAINT promotion_campaign_budget_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.promotion_promotion_rule
(
    promotion_id text COLLATE pg_catalog."default" NOT NULL,
    promotion_rule_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT promotion_promotion_rule_pkey PRIMARY KEY (promotion_id, promotion_rule_id)
);

CREATE TABLE IF NOT EXISTS public.promotion_rule
(
    id text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    attribute text COLLATE pg_catalog."default" NOT NULL,
    operator text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT promotion_rule_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.promotion_rule_value
(
    id text COLLATE pg_catalog."default" NOT NULL,
    promotion_rule_id text COLLATE pg_catalog."default" NOT NULL,
    value text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT promotion_rule_value_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.provider_identity
(
    id text COLLATE pg_catalog."default" NOT NULL,
    entity_id text COLLATE pg_catalog."default" NOT NULL,
    provider text COLLATE pg_catalog."default" NOT NULL,
    auth_identity_id text COLLATE pg_catalog."default" NOT NULL,
    user_metadata jsonb,
    provider_metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT provider_identity_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.publishable_api_key_sales_channel
(
    publishable_key_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    sales_channel_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT publishable_api_key_sales_channel_pkey PRIMARY KEY (publishable_key_id, sales_channel_id)
);

CREATE TABLE IF NOT EXISTS public.refund
(
    id text COLLATE pg_catalog."default" NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    payment_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    created_by text COLLATE pg_catalog."default",
    metadata jsonb,
    refund_reason_id text COLLATE pg_catalog."default",
    note text COLLATE pg_catalog."default",
    CONSTRAINT refund_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.refund_reason
(
    id text COLLATE pg_catalog."default" NOT NULL,
    label text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT refund_reason_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.region
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    currency_code text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    automatic_taxes boolean NOT NULL DEFAULT true,
    CONSTRAINT region_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.region_country
(
    iso_2 text COLLATE pg_catalog."default" NOT NULL,
    iso_3 text COLLATE pg_catalog."default" NOT NULL,
    num_code text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    display_name text COLLATE pg_catalog."default" NOT NULL,
    region_id text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT region_country_pkey PRIMARY KEY (iso_2)
);

CREATE TABLE IF NOT EXISTS public.region_payment_provider
(
    region_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    payment_provider_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT region_payment_provider_pkey PRIMARY KEY (region_id, payment_provider_id)
);

CREATE TABLE IF NOT EXISTS public.reservation_item
(
    id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    line_item_id text COLLATE pg_catalog."default",
    location_id text COLLATE pg_catalog."default" NOT NULL,
    quantity numeric NOT NULL,
    external_id text COLLATE pg_catalog."default",
    description text COLLATE pg_catalog."default",
    created_by text COLLATE pg_catalog."default",
    metadata jsonb,
    inventory_item_id text COLLATE pg_catalog."default" NOT NULL,
    allow_backorder boolean DEFAULT false,
    raw_quantity jsonb,
    CONSTRAINT reservation_item_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."return"
(
    id text COLLATE pg_catalog."default" NOT NULL,
    order_id text COLLATE pg_catalog."default" NOT NULL,
    claim_id text COLLATE pg_catalog."default",
    exchange_id text COLLATE pg_catalog."default",
    order_version integer NOT NULL,
    display_id serial NOT NULL,
    status return_status_enum NOT NULL DEFAULT 'open'::return_status_enum,
    no_notification boolean,
    refund_amount numeric,
    raw_refund_amount jsonb,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    received_at timestamp with time zone,
    canceled_at timestamp with time zone,
    location_id text COLLATE pg_catalog."default",
    requested_at timestamp with time zone,
    created_by text COLLATE pg_catalog."default",
    CONSTRAINT return_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.return_fulfillment
(
    return_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    fulfillment_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT return_fulfillment_pkey PRIMARY KEY (return_id, fulfillment_id)
);

CREATE TABLE IF NOT EXISTS public.return_item
(
    id text COLLATE pg_catalog."default" NOT NULL,
    return_id text COLLATE pg_catalog."default" NOT NULL,
    reason_id text COLLATE pg_catalog."default",
    item_id text COLLATE pg_catalog."default" NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    received_quantity numeric NOT NULL DEFAULT 0,
    raw_received_quantity jsonb NOT NULL,
    note text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    damaged_quantity numeric NOT NULL DEFAULT 0,
    raw_damaged_quantity jsonb NOT NULL,
    CONSTRAINT return_item_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.return_reason
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    value character varying COLLATE pg_catalog."default" NOT NULL,
    label character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default",
    metadata jsonb,
    parent_return_reason_id character varying COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT return_reason_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.sales_channel
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    is_disabled boolean NOT NULL DEFAULT false,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT sales_channel_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.sales_channel_stock_location
(
    sales_channel_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    stock_location_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT sales_channel_stock_location_pkey PRIMARY KEY (sales_channel_id, stock_location_id)
);

CREATE TABLE IF NOT EXISTS public.script_migrations
(
    id serial NOT NULL,
    script_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    finished_at timestamp with time zone,
    CONSTRAINT script_migrations_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.service_zone
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    fulfillment_set_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT service_zone_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.shipping_option
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    price_type text COLLATE pg_catalog."default" NOT NULL DEFAULT 'flat'::text,
    service_zone_id text COLLATE pg_catalog."default" NOT NULL,
    shipping_profile_id text COLLATE pg_catalog."default",
    provider_id text COLLATE pg_catalog."default",
    data jsonb,
    metadata jsonb,
    shipping_option_type_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_option_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.shipping_option_price_set
(
    shipping_option_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    price_set_id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_option_price_set_pkey PRIMARY KEY (shipping_option_id, price_set_id)
);

CREATE TABLE IF NOT EXISTS public.shipping_option_rule
(
    id text COLLATE pg_catalog."default" NOT NULL,
    attribute text COLLATE pg_catalog."default" NOT NULL,
    operator text COLLATE pg_catalog."default" NOT NULL,
    value jsonb,
    shipping_option_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_option_rule_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.shipping_option_type
(
    id text COLLATE pg_catalog."default" NOT NULL,
    label text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    code text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_option_type_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.shipping_profile
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    type text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_profile_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.stock_location
(
    id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    name text COLLATE pg_catalog."default" NOT NULL,
    address_id text COLLATE pg_catalog."default",
    metadata jsonb,
    CONSTRAINT stock_location_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.stock_location_address
(
    id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    address_1 text COLLATE pg_catalog."default" NOT NULL,
    address_2 text COLLATE pg_catalog."default",
    company text COLLATE pg_catalog."default",
    city text COLLATE pg_catalog."default",
    country_code text COLLATE pg_catalog."default" NOT NULL,
    phone text COLLATE pg_catalog."default",
    province text COLLATE pg_catalog."default",
    postal_code text COLLATE pg_catalog."default",
    metadata jsonb,
    CONSTRAINT stock_location_address_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.store
(
    id text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL DEFAULT 'Medusa Store'::text,
    default_sales_channel_id text COLLATE pg_catalog."default",
    default_region_id text COLLATE pg_catalog."default",
    default_location_id text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT store_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.store_currency
(
    id text COLLATE pg_catalog."default" NOT NULL,
    currency_code text COLLATE pg_catalog."default" NOT NULL,
    is_default boolean NOT NULL DEFAULT false,
    store_id text COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT store_currency_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tax_provider
(
    id text COLLATE pg_catalog."default" NOT NULL,
    is_enabled boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT tax_provider_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tax_rate
(
    id text COLLATE pg_catalog."default" NOT NULL,
    rate real,
    code text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    is_default boolean NOT NULL DEFAULT false,
    is_combinable boolean NOT NULL DEFAULT false,
    tax_region_id text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    created_by text COLLATE pg_catalog."default",
    deleted_at timestamp with time zone,
    CONSTRAINT tax_rate_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tax_rate_rule
(
    id text COLLATE pg_catalog."default" NOT NULL,
    tax_rate_id text COLLATE pg_catalog."default" NOT NULL,
    reference_id text COLLATE pg_catalog."default" NOT NULL,
    reference text COLLATE pg_catalog."default" NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    created_by text COLLATE pg_catalog."default",
    deleted_at timestamp with time zone,
    CONSTRAINT tax_rate_rule_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tax_region
(
    id text COLLATE pg_catalog."default" NOT NULL,
    provider_id text COLLATE pg_catalog."default",
    country_code text COLLATE pg_catalog."default" NOT NULL,
    province_code text COLLATE pg_catalog."default",
    parent_id text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    created_by text COLLATE pg_catalog."default",
    deleted_at timestamp with time zone,
    CONSTRAINT tax_region_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public."user"
(
    id text COLLATE pg_catalog."default" NOT NULL,
    first_name text COLLATE pg_catalog."default",
    last_name text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default" NOT NULL,
    avatar_url text COLLATE pg_catalog."default",
    metadata jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    CONSTRAINT user_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.workflow_execution
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    workflow_id character varying COLLATE pg_catalog."default" NOT NULL,
    transaction_id character varying COLLATE pg_catalog."default" NOT NULL,
    execution jsonb,
    context jsonb,
    state character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    deleted_at timestamp without time zone,
    retention_time integer,
    run_id text COLLATE pg_catalog."default" NOT NULL DEFAULT '01JZT36TEN1HHN9Q6CT258QZRM'::text,
    CONSTRAINT workflow_execution_pkey PRIMARY KEY (workflow_id, transaction_id, run_id)
);

ALTER TABLE IF EXISTS public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_application_method_id_foreign FOREIGN KEY (application_method_id)
    REFERENCES public.promotion_application_method (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id)
    REFERENCES public.promotion_rule (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_application_method_id_foreign FOREIGN KEY (application_method_id)
    REFERENCES public.promotion_application_method (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id)
    REFERENCES public.promotion_rule (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.capture
    ADD CONSTRAINT capture_payment_id_foreign FOREIGN KEY (payment_id)
    REFERENCES public.payment (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_capture_payment_id"
    ON public.capture(payment_id);


ALTER TABLE IF EXISTS public.cart
    ADD CONSTRAINT cart_billing_address_id_foreign FOREIGN KEY (billing_address_id)
    REFERENCES public.cart_address (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS "IDX_cart_billing_address_id"
    ON public.cart(billing_address_id);


ALTER TABLE IF EXISTS public.cart
    ADD CONSTRAINT cart_shipping_address_id_foreign FOREIGN KEY (shipping_address_id)
    REFERENCES public.cart_address (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS "IDX_cart_shipping_address_id"
    ON public.cart(shipping_address_id);


ALTER TABLE IF EXISTS public.cart_line_item
    ADD CONSTRAINT cart_line_item_cart_id_foreign FOREIGN KEY (cart_id)
    REFERENCES public.cart (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_line_item_cart_id"
    ON public.cart_line_item(cart_id);


ALTER TABLE IF EXISTS public.cart_line_item_adjustment
    ADD CONSTRAINT cart_line_item_adjustment_item_id_foreign FOREIGN KEY (item_id)
    REFERENCES public.cart_line_item (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_adjustment_item_id"
    ON public.cart_line_item_adjustment(item_id);


ALTER TABLE IF EXISTS public.cart_line_item_tax_line
    ADD CONSTRAINT cart_line_item_tax_line_item_id_foreign FOREIGN KEY (item_id)
    REFERENCES public.cart_line_item (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_tax_line_item_id"
    ON public.cart_line_item_tax_line(item_id);


ALTER TABLE IF EXISTS public.cart_shipping_method
    ADD CONSTRAINT cart_shipping_method_cart_id_foreign FOREIGN KEY (cart_id)
    REFERENCES public.cart (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_shipping_method_cart_id"
    ON public.cart_shipping_method(cart_id);


ALTER TABLE IF EXISTS public.cart_shipping_method_adjustment
    ADD CONSTRAINT cart_shipping_method_adjustment_shipping_method_id_foreign FOREIGN KEY (shipping_method_id)
    REFERENCES public.cart_shipping_method (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_adjustment_shipping_method_id"
    ON public.cart_shipping_method_adjustment(shipping_method_id);


ALTER TABLE IF EXISTS public.cart_shipping_method_tax_line
    ADD CONSTRAINT cart_shipping_method_tax_line_shipping_method_id_foreign FOREIGN KEY (shipping_method_id)
    REFERENCES public.cart_shipping_method (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_tax_line_shipping_method_id"
    ON public.cart_shipping_method_tax_line(shipping_method_id);


ALTER TABLE IF EXISTS public.credit_line
    ADD CONSTRAINT credit_line_cart_id_foreign FOREIGN KEY (cart_id)
    REFERENCES public.cart (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;
CREATE INDEX IF NOT EXISTS "IDX_credit_line_cart_id"
    ON public.credit_line(cart_id);


ALTER TABLE IF EXISTS public.customer_address
    ADD CONSTRAINT customer_address_customer_id_foreign FOREIGN KEY (customer_id)
    REFERENCES public.customer (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_customer_address_customer_id"
    ON public.customer_address(customer_id);


ALTER TABLE IF EXISTS public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_customer_group_id_foreign FOREIGN KEY (customer_group_id)
    REFERENCES public.customer_group (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_customer_group_customer_customer_group_id"
    ON public.customer_group_customer(customer_group_id);


ALTER TABLE IF EXISTS public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_customer_id_foreign FOREIGN KEY (customer_id)
    REFERENCES public.customer (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_customer_group_customer_customer_id"
    ON public.customer_group_customer(customer_id);


ALTER TABLE IF EXISTS public.fulfillment
    ADD CONSTRAINT fulfillment_delivery_address_id_foreign FOREIGN KEY (delivery_address_id)
    REFERENCES public.fulfillment_address (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;


ALTER TABLE IF EXISTS public.fulfillment
    ADD CONSTRAINT fulfillment_provider_id_foreign FOREIGN KEY (provider_id)
    REFERENCES public.fulfillment_provider (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;


ALTER TABLE IF EXISTS public.fulfillment
    ADD CONSTRAINT fulfillment_shipping_option_id_foreign FOREIGN KEY (shipping_option_id)
    REFERENCES public.shipping_option (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS "IDX_fulfillment_shipping_option_id"
    ON public.fulfillment(shipping_option_id);


ALTER TABLE IF EXISTS public.fulfillment_item
    ADD CONSTRAINT fulfillment_item_fulfillment_id_foreign FOREIGN KEY (fulfillment_id)
    REFERENCES public.fulfillment (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_fulfillment_item_fulfillment_id"
    ON public.fulfillment_item(fulfillment_id);


ALTER TABLE IF EXISTS public.fulfillment_label
    ADD CONSTRAINT fulfillment_label_fulfillment_id_foreign FOREIGN KEY (fulfillment_id)
    REFERENCES public.fulfillment (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_fulfillment_label_fulfillment_id"
    ON public.fulfillment_label(fulfillment_id);


ALTER TABLE IF EXISTS public.geo_zone
    ADD CONSTRAINT geo_zone_service_zone_id_foreign FOREIGN KEY (service_zone_id)
    REFERENCES public.service_zone (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_geo_zone_service_zone_id"
    ON public.geo_zone(service_zone_id);


ALTER TABLE IF EXISTS public.image
    ADD CONSTRAINT image_product_id_foreign FOREIGN KEY (product_id)
    REFERENCES public.product (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_image_product_id"
    ON public.image(product_id);


ALTER TABLE IF EXISTS public.inventory_level
    ADD CONSTRAINT inventory_level_inventory_item_id_foreign FOREIGN KEY (inventory_item_id)
    REFERENCES public.inventory_item (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_inventory_level_inventory_item_id"
    ON public.inventory_level(inventory_item_id);


ALTER TABLE IF EXISTS public.notification
    ADD CONSTRAINT notification_provider_id_foreign FOREIGN KEY (provider_id)
    REFERENCES public.notification_provider (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS "IDX_notification_provider_id"
    ON public.notification(provider_id);


ALTER TABLE IF EXISTS public."order"
    ADD CONSTRAINT order_billing_address_id_foreign FOREIGN KEY (billing_address_id)
    REFERENCES public.order_address (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_order_billing_address_id"
    ON public."order"(billing_address_id);


ALTER TABLE IF EXISTS public."order"
    ADD CONSTRAINT order_shipping_address_id_foreign FOREIGN KEY (shipping_address_id)
    REFERENCES public.order_address (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_order_shipping_address_id"
    ON public."order"(shipping_address_id);


ALTER TABLE IF EXISTS public.order_change
    ADD CONSTRAINT order_change_order_id_foreign FOREIGN KEY (order_id)
    REFERENCES public."order" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_order_change_order_id"
    ON public.order_change(order_id);


ALTER TABLE IF EXISTS public.order_change_action
    ADD CONSTRAINT order_change_action_order_change_id_foreign FOREIGN KEY (order_change_id)
    REFERENCES public.order_change (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_order_change_action_order_change_id"
    ON public.order_change_action(order_change_id);


ALTER TABLE IF EXISTS public.order_credit_line
    ADD CONSTRAINT order_credit_line_order_id_foreign FOREIGN KEY (order_id)
    REFERENCES public."order" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_order_credit_line_order_id"
    ON public.order_credit_line(order_id);


ALTER TABLE IF EXISTS public.order_item
    ADD CONSTRAINT order_item_item_id_foreign FOREIGN KEY (item_id)
    REFERENCES public.order_line_item (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_order_item_item_id"
    ON public.order_item(item_id);


ALTER TABLE IF EXISTS public.order_item
    ADD CONSTRAINT order_item_order_id_foreign FOREIGN KEY (order_id)
    REFERENCES public."order" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_order_item_order_id"
    ON public.order_item(order_id);


ALTER TABLE IF EXISTS public.order_line_item
    ADD CONSTRAINT order_line_item_totals_id_foreign FOREIGN KEY (totals_id)
    REFERENCES public.order_item (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.order_line_item_adjustment
    ADD CONSTRAINT order_line_item_adjustment_item_id_foreign FOREIGN KEY (item_id)
    REFERENCES public.order_line_item (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_order_line_item_adjustment_item_id"
    ON public.order_line_item_adjustment(item_id);


ALTER TABLE IF EXISTS public.order_line_item_tax_line
    ADD CONSTRAINT order_line_item_tax_line_item_id_foreign FOREIGN KEY (item_id)
    REFERENCES public.order_line_item (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_order_line_item_tax_line_item_id"
    ON public.order_line_item_tax_line(item_id);


ALTER TABLE IF EXISTS public.order_shipping
    ADD CONSTRAINT order_shipping_order_id_foreign FOREIGN KEY (order_id)
    REFERENCES public."order" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_order_shipping_order_id"
    ON public.order_shipping(order_id);


ALTER TABLE IF EXISTS public.order_shipping_method_adjustment
    ADD CONSTRAINT order_shipping_method_adjustment_shipping_method_id_foreign FOREIGN KEY (shipping_method_id)
    REFERENCES public.order_shipping_method (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_order_shipping_method_adjustment_shipping_method_id"
    ON public.order_shipping_method_adjustment(shipping_method_id);


ALTER TABLE IF EXISTS public.order_shipping_method_tax_line
    ADD CONSTRAINT order_shipping_method_tax_line_shipping_method_id_foreign FOREIGN KEY (shipping_method_id)
    REFERENCES public.order_shipping_method (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_order_shipping_method_tax_line_shipping_method_id"
    ON public.order_shipping_method_tax_line(shipping_method_id);


ALTER TABLE IF EXISTS public.order_summary
    ADD CONSTRAINT order_summary_order_id_foreign FOREIGN KEY (order_id)
    REFERENCES public."order" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.order_transaction
    ADD CONSTRAINT order_transaction_order_id_foreign FOREIGN KEY (order_id)
    REFERENCES public."order" (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.payment
    ADD CONSTRAINT payment_payment_collection_id_foreign FOREIGN KEY (payment_collection_id)
    REFERENCES public.payment_collection (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_payment_payment_collection_id"
    ON public.payment(payment_collection_id);


ALTER TABLE IF EXISTS public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_payment_col_aa276_foreign FOREIGN KEY (payment_collection_id)
    REFERENCES public.payment_collection (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_payment_pro_2d555_foreign FOREIGN KEY (payment_provider_id)
    REFERENCES public.payment_provider (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.payment_session
    ADD CONSTRAINT payment_session_payment_collection_id_foreign FOREIGN KEY (payment_collection_id)
    REFERENCES public.payment_collection (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_payment_session_payment_collection_id"
    ON public.payment_session(payment_collection_id);


ALTER TABLE IF EXISTS public.price
    ADD CONSTRAINT price_price_list_id_foreign FOREIGN KEY (price_list_id)
    REFERENCES public.price_list (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_price_price_list_id"
    ON public.price(price_list_id);


ALTER TABLE IF EXISTS public.price
    ADD CONSTRAINT price_price_set_id_foreign FOREIGN KEY (price_set_id)
    REFERENCES public.price_set (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_price_price_set_id"
    ON public.price(price_set_id);


ALTER TABLE IF EXISTS public.price_list_rule
    ADD CONSTRAINT price_list_rule_price_list_id_foreign FOREIGN KEY (price_list_id)
    REFERENCES public.price_list (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_price_list_rule_price_list_id"
    ON public.price_list_rule(price_list_id);


ALTER TABLE IF EXISTS public.price_rule
    ADD CONSTRAINT price_rule_price_id_foreign FOREIGN KEY (price_id)
    REFERENCES public.price (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_price_rule_price_id"
    ON public.price_rule(price_id);


ALTER TABLE IF EXISTS public.product
    ADD CONSTRAINT product_collection_id_foreign FOREIGN KEY (collection_id)
    REFERENCES public.product_collection (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS "IDX_product_collection_id"
    ON public.product(collection_id);


ALTER TABLE IF EXISTS public.product
    ADD CONSTRAINT product_type_id_foreign FOREIGN KEY (type_id)
    REFERENCES public.product_type (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS "IDX_product_type_id"
    ON public.product(type_id);


ALTER TABLE IF EXISTS public.product_category
    ADD CONSTRAINT product_category_parent_category_id_foreign FOREIGN KEY (parent_category_id)
    REFERENCES public.product_category (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_product_category_parent_category_id"
    ON public.product_category(parent_category_id);


ALTER TABLE IF EXISTS public.product_category_product
    ADD CONSTRAINT product_category_product_product_category_id_foreign FOREIGN KEY (product_category_id)
    REFERENCES public.product_category (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.product_category_product
    ADD CONSTRAINT product_category_product_product_id_foreign FOREIGN KEY (product_id)
    REFERENCES public.product (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.product_option
    ADD CONSTRAINT product_option_product_id_foreign FOREIGN KEY (product_id)
    REFERENCES public.product (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_product_option_product_id"
    ON public.product_option(product_id);


ALTER TABLE IF EXISTS public.product_option_value
    ADD CONSTRAINT product_option_value_option_id_foreign FOREIGN KEY (option_id)
    REFERENCES public.product_option (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_product_option_value_option_id"
    ON public.product_option_value(option_id);


ALTER TABLE IF EXISTS public.product_tags
    ADD CONSTRAINT product_tags_product_id_foreign FOREIGN KEY (product_id)
    REFERENCES public.product (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.product_tags
    ADD CONSTRAINT product_tags_product_tag_id_foreign FOREIGN KEY (product_tag_id)
    REFERENCES public.product_tag (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.product_variant
    ADD CONSTRAINT product_variant_product_id_foreign FOREIGN KEY (product_id)
    REFERENCES public.product (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_product_variant_product_id"
    ON public.product_variant(product_id);


ALTER TABLE IF EXISTS public.product_variant_option
    ADD CONSTRAINT product_variant_option_option_value_id_foreign FOREIGN KEY (option_value_id)
    REFERENCES public.product_option_value (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.product_variant_option
    ADD CONSTRAINT product_variant_option_variant_id_foreign FOREIGN KEY (variant_id)
    REFERENCES public.product_variant (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.promotion
    ADD CONSTRAINT promotion_campaign_id_foreign FOREIGN KEY (campaign_id)
    REFERENCES public.promotion_campaign (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS "IDX_promotion_campaign_id"
    ON public.promotion(campaign_id);


ALTER TABLE IF EXISTS public.promotion_application_method
    ADD CONSTRAINT promotion_application_method_promotion_id_foreign FOREIGN KEY (promotion_id)
    REFERENCES public.promotion (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_promotion_application_method_promotion_id_unique"
    ON public.promotion_application_method(promotion_id);


ALTER TABLE IF EXISTS public.promotion_campaign_budget
    ADD CONSTRAINT promotion_campaign_budget_campaign_id_foreign FOREIGN KEY (campaign_id)
    REFERENCES public.promotion_campaign (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_promotion_campaign_budget_campaign_id_unique"
    ON public.promotion_campaign_budget(campaign_id);


ALTER TABLE IF EXISTS public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_promotion_id_foreign FOREIGN KEY (promotion_id)
    REFERENCES public.promotion (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id)
    REFERENCES public.promotion_rule (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;


ALTER TABLE IF EXISTS public.promotion_rule_value
    ADD CONSTRAINT promotion_rule_value_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id)
    REFERENCES public.promotion_rule (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_promotion_rule_value_promotion_rule_id"
    ON public.promotion_rule_value(promotion_rule_id);


ALTER TABLE IF EXISTS public.provider_identity
    ADD CONSTRAINT provider_identity_auth_identity_id_foreign FOREIGN KEY (auth_identity_id)
    REFERENCES public.auth_identity (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_provider_identity_auth_identity_id"
    ON public.provider_identity(auth_identity_id);


ALTER TABLE IF EXISTS public.refund
    ADD CONSTRAINT refund_payment_id_foreign FOREIGN KEY (payment_id)
    REFERENCES public.payment (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_refund_payment_id"
    ON public.refund(payment_id);


ALTER TABLE IF EXISTS public.region_country
    ADD CONSTRAINT region_country_region_id_foreign FOREIGN KEY (region_id)
    REFERENCES public.region (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS "IDX_region_country_region_id"
    ON public.region_country(region_id);


ALTER TABLE IF EXISTS public.reservation_item
    ADD CONSTRAINT reservation_item_inventory_item_id_foreign FOREIGN KEY (inventory_item_id)
    REFERENCES public.inventory_item (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_reservation_item_inventory_item_id"
    ON public.reservation_item(inventory_item_id);


ALTER TABLE IF EXISTS public.return_reason
    ADD CONSTRAINT return_reason_parent_return_reason_id_foreign FOREIGN KEY (parent_return_reason_id)
    REFERENCES public.return_reason (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.service_zone
    ADD CONSTRAINT service_zone_fulfillment_set_id_foreign FOREIGN KEY (fulfillment_set_id)
    REFERENCES public.fulfillment_set (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_service_zone_fulfillment_set_id"
    ON public.service_zone(fulfillment_set_id);


ALTER TABLE IF EXISTS public.shipping_option
    ADD CONSTRAINT shipping_option_provider_id_foreign FOREIGN KEY (provider_id)
    REFERENCES public.fulfillment_provider (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS "IDX_shipping_option_provider_id"
    ON public.shipping_option(provider_id);


ALTER TABLE IF EXISTS public.shipping_option
    ADD CONSTRAINT shipping_option_service_zone_id_foreign FOREIGN KEY (service_zone_id)
    REFERENCES public.service_zone (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_shipping_option_service_zone_id"
    ON public.shipping_option(service_zone_id);


ALTER TABLE IF EXISTS public.shipping_option
    ADD CONSTRAINT shipping_option_shipping_option_type_id_foreign FOREIGN KEY (shipping_option_type_id)
    REFERENCES public.shipping_option_type (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.shipping_option
    ADD CONSTRAINT shipping_option_shipping_profile_id_foreign FOREIGN KEY (shipping_profile_id)
    REFERENCES public.shipping_profile (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS "IDX_shipping_option_shipping_profile_id"
    ON public.shipping_option(shipping_profile_id);


ALTER TABLE IF EXISTS public.shipping_option_rule
    ADD CONSTRAINT shipping_option_rule_shipping_option_id_foreign FOREIGN KEY (shipping_option_id)
    REFERENCES public.shipping_option (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_shipping_option_rule_shipping_option_id"
    ON public.shipping_option_rule(shipping_option_id);


ALTER TABLE IF EXISTS public.stock_location
    ADD CONSTRAINT stock_location_address_id_foreign FOREIGN KEY (address_id)
    REFERENCES public.stock_location_address (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_stock_location_address_id_unique"
    ON public.stock_location(address_id);


ALTER TABLE IF EXISTS public.store_currency
    ADD CONSTRAINT store_currency_store_id_foreign FOREIGN KEY (store_id)
    REFERENCES public.store (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_store_currency_store_id"
    ON public.store_currency(store_id);


ALTER TABLE IF EXISTS public.tax_rate
    ADD CONSTRAINT "FK_tax_rate_tax_region_id" FOREIGN KEY (tax_region_id)
    REFERENCES public.tax_region (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_tax_rate_tax_region_id"
    ON public.tax_rate(tax_region_id);


ALTER TABLE IF EXISTS public.tax_rate_rule
    ADD CONSTRAINT "FK_tax_rate_rule_tax_rate_id" FOREIGN KEY (tax_rate_id)
    REFERENCES public.tax_rate (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_tax_rate_rule_tax_rate_id"
    ON public.tax_rate_rule(tax_rate_id);


ALTER TABLE IF EXISTS public.tax_region
    ADD CONSTRAINT "FK_tax_region_parent_id" FOREIGN KEY (parent_id)
    REFERENCES public.tax_region (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS "IDX_tax_region_parent_id"
    ON public.tax_region(parent_id);


ALTER TABLE IF EXISTS public.tax_region
    ADD CONSTRAINT "FK_tax_region_provider_id" FOREIGN KEY (provider_id)
    REFERENCES public.tax_provider (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS "IDX_tax_region_provider_id"
    ON public.tax_region(provider_id);



--------------------------------------------------------------
-- ALTERATIONS
--------------------------------------------------------------

ALTER TABLE public.customer ADD COLUMN pfp_url text;

ALTER TABLE public.customer_address
ADD COLUMN house_no TEXT,
ADD COLUMN street_no TEXT,
ADD COLUMN house_type TEXT;

CREATE TABLE IF NOT EXISTS card (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES customer(id) ON DELETE CASCADE,
  card_type TEXT,
  encrypted_card_number TEXT NOT NULL,
  encrypted_security_code TEXT NOT NULL,
  card_name TEXT,
  expiry_date TEXT
);

CREATE TABLE IF NOT EXISTS public.user_orders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL,
    card_id TEXT NOT NULL,
    address_id TEXT NOT NULL,
    items JSONB NOT NULL,
    total_price NUMERIC,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cart (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cart
ADD COLUMN customer_id UUID;

CREATE TABLE cart_item (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid NOT NULL,
  product_id text NOT NULL,
  quantity integer NOT NULL,
  customizations jsonb NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_cart
    FOREIGN KEY(cart_id)
    REFERENCES cart(id)
    ON DELETE CASCADE
);

CREATE TABLE customization_option (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    name TEXT NOT NULL,
    input_type TEXT NOT NULL,
    required BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE customization_value (
    id TEXT PRIMARY KEY,
    option_id TEXT NOT NULL,
    value TEXT NOT NULL,
    image_url TEXT,
    additional_price DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints for customization tables
ALTER TABLE customization_option 
ADD CONSTRAINT customization_option_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES custom_product(id) ON DELETE CASCADE;

ALTER TABLE customization_value 
ADD CONSTRAINT customization_value_option_id_fkey 
FOREIGN KEY (option_id) REFERENCES customization_option(id) ON DELETE CASCADE;

--------------------------------------------------------------
-- CUSTOM PRODUCT TABLE FOR BLINDZY CUSTOM PRODUCTS
--------------------------------------------------------------

-- Create custom_product table for our custom product management
-- This is separate from the standard Medusa product table
CREATE TABLE IF NOT EXISTS custom_product (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,                                    -- e.g., "Roller", "Vertical", "Roman"
    base_price DECIMAL(10,2) NOT NULL,                     -- Base price before customizations
    image_url TEXT,                                        -- Main product image URL
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_custom_product_type ON custom_product(type);
CREATE INDEX IF NOT EXISTS idx_custom_product_created_at ON custom_product(created_at);

-- Note: customization_option and customization_value tables already exist above
-- and reference product_id which will work with our custom_product.id

-- ========================================
-- ADDITIONAL TABLE ALTERATIONS FOR CART AND ORDERS
-- ========================================

-- Update cart_item table to ensure proper structure
DROP TABLE IF EXISTS cart_item CASCADE;
CREATE TABLE cart_item (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cart_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  customizations JSONB NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_cart_item_cart
    FOREIGN KEY(cart_id)
    REFERENCES cart(id)
    ON DELETE CASCADE
);

-- Ensure user_orders table exists with proper structure
DROP TABLE IF EXISTS user_orders CASCADE;
CREATE TABLE user_orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_id TEXT NOT NULL,
  card_id TEXT NOT NULL,
  address_id TEXT NOT NULL,
  items JSONB NOT NULL,
  total_price NUMERIC,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user_orders_customer
    FOREIGN KEY(customer_id)
    REFERENCES customer(id)
    ON DELETE CASCADE
);

-- Update cart table to include currency_code (required by Medusa)
ALTER TABLE cart ADD COLUMN IF NOT EXISTS currency_code TEXT DEFAULT 'USD';
ALTER TABLE cart ADD COLUMN IF NOT EXISTS customer_id TEXT;
ALTER TABLE cart ADD CONSTRAINT fk_cart_customer 
  FOREIGN KEY(customer_id) REFERENCES customer(id) ON DELETE CASCADE;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_item_cart_id ON cart_item(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_item_product_id ON cart_item(product_id);
CREATE INDEX IF NOT EXISTS idx_user_orders_customer_id ON user_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_user_orders_status ON user_orders(status);
CREATE INDEX IF NOT EXISTS idx_user_orders_created_at ON user_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_cart_customer_id ON cart(customer_id);
CREATE INDEX IF NOT EXISTS idx_cart_email ON cart(email);

-- ========================================
-- END OF ADDITIONAL ALTERATIONS
-- ========================================
