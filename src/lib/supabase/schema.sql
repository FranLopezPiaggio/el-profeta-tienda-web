-- El Profeta - Supabase Database Schema
-- Phase 5: Simple CMS - Orders, Customers & Reports

-- ============================================
-- CUSTOMERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for phone lookups (used for customer upsert)
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Index for created_at queries
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

-- ============================================
-- ORDERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT UNIQUE NOT NULL, -- Format: ORD-YYYYMMDD-XXXX
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for order_id lookups
CREATE INDEX IF NOT EXISTS idx_orders_order_id ON orders(order_id);

-- Index for customer_id foreign key
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- ============================================
-- ORDER_ITEMS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for order_id foreign key
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Index for product aggregation queries
CREATE INDEX IF NOT EXISTS idx_order_items_product_name ON order_items(product_name);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CUSTOMERS RLS POLICIES
-- ============================================

-- Policy: Users can read their own customer record by phone
CREATE POLICY " customers_select_own"
ON customers FOR SELECT
USING (
    phone = auth.jwt()->>'phone'
    OR email = auth.jwt()->'email'
);

-- Policy: Service role can do everything
CREATE POLICY "customers_service_role"
ON customers FOR ALL
USING (auth.role() = 'service_role');

-- ============================================
-- ORDERS RLS POLICIES
-- ============================================

-- Policy: Users can read their own orders
CREATE POLICY "orders_select_own"
ON orders FOR SELECT
USING (
    customer_phone = auth.jwt()->>'phone'
    OR auth.role() = 'authenticated'
);

-- Policy: Authenticated users can insert orders (for checkout)
CREATE POLICY "orders_insert_authenticated"
ON orders FOR INSERT
WITH CHECK (auth.role() IN ('authenticated', 'anon'));

-- Policy: Authenticated users can update order status
CREATE POLICY "orders_update_status"
ON orders FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy: Service role can do everything
CREATE POLICY "orders_service_role"
ON orders FOR ALL
USING (auth.role() = 'service_role');

-- ============================================
-- ORDER_ITEMS RLS POLICIES
-- ============================================

-- Policy: Users can read order items for their orders
CREATE POLICY "order_items_select_own"
ON order_items FOR SELECT
USING (
    order_id IN (
        SELECT id FROM orders WHERE customer_phone = auth.jwt()->>'phone'
    )
    OR auth.role() = 'authenticated'
);

-- Policy: Authenticated users can insert order items
CREATE POLICY "order_items_insert_authenticated"
ON order_items FOR INSERT
WITH CHECK (auth.role() IN ('authenticated', 'anon'));

-- Policy: Service role can do everything
CREATE POLICY "order_items_service_role"
ON order_items FOR ALL
USING (auth.role() = 'service_role');

-- ============================================
-- DATABASE FUNCTIONS
-- ============================================

-- Function to generate order ID (ORD-YYYYMMDD-XXXX)
CREATE OR REPLACE FUNCTION generate_order_id()
RETURNS TEXT AS $$
DECLARE
    date_part TEXT;
    random_part TEXT;
    new_order_id TEXT;
    existing_count INTEGER;
BEGIN
    -- Get today's date in YYYYMMDD format
    date_part := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
    
    -- Generate random 4-character hex
    random_part := LPAD(TO_HEX(FLOOR(RANDOM() * 65535)::INT), 4, '0');
    
    -- Combine
    new_order_id := 'ORD-' || date_part || '-' || random_part;
    
    -- Check for collision and retry if needed
    SELECT COUNT(*) INTO existing_count FROM orders WHERE order_id = new_order_id;
    IF existing_count > 0 THEN
        -- Simple retry with different random
        random_part := LPAD(TO_HEX(FLOOR(RANDOM() * 65535)::INT), 4, '0');
        new_order_id := 'ORD-' || date_part || '-' || random_part;
    END IF;
    
    RETURN new_order_id;
END;
$$ LANGUAGE plpgsql;

-- Function to upsert customer (find by phone or create new)
CREATE OR REPLACE FUNCTION upsert_customer(
    p_name TEXT,
    p_phone TEXT,
    p_email TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    customer_id UUID;
BEGIN
    -- Try to find existing customer by phone
    SELECT id INTO customer_id
    FROM customers
    WHERE phone = p_phone;
    
    -- If not found, create new
    IF customer_id IS NULL THEN
        INSERT INTO customers (name, phone, email)
        VALUES (p_name, p_phone, p_email)
        RETURNING id INTO customer_id;
    ELSE
        -- Update existing customer info
        UPDATE customers
        SET name = p_name, email = COALESCE(p_email, email), updated_at = NOW()
        WHERE id = customer_id;
    END IF;
    
    RETURN customer_id;
END;
$$ LANGUAGE plpgsql;

-- Function to save order with items (atomic operation)
CREATE OR REPLACE FUNCTION save_order(
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_customer_address TEXT,
    p_email TEXT DEFAULT NULL,
    p_items JSONB,
    p_total DECIMAL(10, 2)
)
RETURNS TEXT AS $$
DECLARE
    new_order_id TEXT;
    customer_uuid UUID;
    item JSONB;
    order_uuid UUID;
BEGIN
    -- Upsert customer and get ID
    customer_uuid := upsert_customer(p_customer_name, p_customer_phone, p_email);
    
    -- Generate order ID
    new_order_id := generate_order_id();
    
    -- Insert order
    INSERT INTO orders (order_id, customer_id, customer_name, customer_phone, customer_address, total)
    VALUES (new_order_id, customer_uuid, p_customer_name, p_customer_phone, p_customer_address, p_total)
    RETURNING id INTO order_uuid;
    
    -- Insert order items
    FOR item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal)
        VALUES (
            order_uuid,
            item->>'id',
            item->>'name',
            (item->>'price')::DECIMAL,
            (item->>'quantity')::INTEGER,
            ((item->>'price')::DECIMAL * (item->>'quantity')::INTEGER)
        );
    END LOOP;
    
    RETURN new_order_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- REPORTS FUNCTIONS
-- ============================================

-- Function to get sales metrics
CREATE OR REPLACE FUNCTION get_sales_metrics(
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL,
    p_status TEXT DEFAULT 'delivered'
)
RETURNS TABLE (
    total_revenue DECIMAL(10, 2),
    orders_count BIGINT,
    average_order_value DECIMAL(10, 2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(o.total), 0)::DECIMAL(10, 2) AS total_revenue,
        COUNT(o.id)::BIGINT AS orders_count,
        COALESCE(AVG(o.total), 0)::DECIMAL(10, 2) AS average_order_value
    FROM orders o
    WHERE o.status = COALESCE(p_status, o.status)
      AND (p_start_date IS NULL OR o.created_at >= p_start_date)
      AND (p_end_date IS NULL OR o.created_at <= p_end_date);
END;
$$ LANGUAGE plpgsql;

-- Function to get top selling products
CREATE OR REPLACE FUNCTION get_top_products(
    p_limit INTEGER DEFAULT 10,
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    product_name TEXT,
    units_sold BIGINT,
    revenue DECIMAL(10, 2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        oi.product_name,
        SUM(oi.quantity)::BIGINT AS units_sold,
        SUM(oi.subtotal)::DECIMAL(10, 2) AS revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE (p_start_date IS NULL OR o.created_at >= p_start_date)
      AND (p_end_date IS NULL OR o.created_at <= p_end_date)
    GROUP BY oi.product_name
    ORDER BY units_sold DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get repeat customer rate
CREATE OR REPLACE FUNCTION get_repeat_customer_rate(
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
    total_customers BIGINT,
    repeat_customers BIGINT,
    repeat_rate DECIMAL(5, 2)
) AS $$
BEGIN
    RETURN QUERY
    WITH customer_orders AS (
        SELECT 
            customer_phone,
            COUNT(DISTINCT id) AS order_count
        FROM orders
        WHERE (p_start_date IS NULL OR created_at >= p_start_date)
          AND (p_end_date IS NULL OR created_at <= p_end_date)
        GROUP BY customer_phone
    )
    SELECT 
        COUNT(*)::BIGINT AS total_customers,
        SUM(CASE WHEN order_count > 1 THEN 1 ELSE 0 END)::BIGINT AS repeat_customers,
        COALESCE(
            (SUM(CASE WHEN order_count > 1 THEN 1 ELSE 0 END)::DECIMAL(10, 2) / NULLIF(COUNT(*), 0)) * 100,
            0
        )::DECIMAL(5, 2) AS repeat_rate
    FROM customer_orders;
END;
$$ LANGUAGE plpgsql;