CREATE TABLE IF NOT EXISTS public.user_orders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_id TEXT NOT NULL,
    card_id TEXT,  -- Making this nullable
    address_id TEXT NOT NULL,
    items JSONB NOT NULL,
    total_price NUMERIC,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_orders TO medusauser;