-- Supplier tables
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS supplier_bills (
    id BIGSERIAL PRIMARY KEY,
    supplier_id BIGINT NOT NULL REFERENCES suppliers(id),
    bill_number VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    purchase_amount NUMERIC(15,2) NOT NULL,
    balance NUMERIC(15,2) NOT NULL,
    gst VARCHAR(50),
    description TEXT,
    is_closed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_supplier_bill UNIQUE (supplier_id, bill_number)
);

CREATE INDEX IF NOT EXISTS idx_supplier_bills_date ON supplier_bills(date);

CREATE TABLE IF NOT EXISTS supplier_settlements (
    id BIGSERIAL PRIMARY KEY,
    bill_id BIGINT NOT NULL REFERENCES supplier_bills(id),
    settlement_amount NUMERIC(15,2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_supplier_settlements_date ON supplier_settlements(date);

-- Customer tables
CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_bills (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    bill_number VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    purchase_amount NUMERIC(15,2) NOT NULL,
    gst VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_customer_bill UNIQUE (customer_id, bill_number)
);

CREATE INDEX IF NOT EXISTS idx_customer_bills_date ON customer_bills(date);

CREATE TABLE IF NOT EXISTS customer_payments (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    payment_amount NUMERIC(15,2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customer_payments_date ON customer_payments(date);


