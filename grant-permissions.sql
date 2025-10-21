-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO medusauser;

-- Grant all privileges on all tables in public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO medusauser;

-- Grant all privileges on all sequences in public schema
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO medusauser;

-- Grant create permission on public schema
GRANT CREATE ON SCHEMA public TO medusauser;

-- Make sure future tables will be accessible
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO medusauser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO medusauser;