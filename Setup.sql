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


ALTER TABLE customer ADD COLUMN username VARCHAR UNIQUE;


ALTER TABLE customer ADD COLUMN password_hash TEXT;


CREATE TABLE otp (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(10) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
