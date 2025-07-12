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


