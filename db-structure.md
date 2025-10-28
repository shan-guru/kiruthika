### Supplier Tables

#### 1. suppliers
| Column Name | Data Type | Constraints/Description |
|-------------|-----------|-------------------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL, UNIQUE (for auto-suggest) |
| phone_number | VARCHAR(20) | NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

#### 2. supplier_bills
| Column Name | Data Type | Constraints/Description |
|-------------|-----------|-------------------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| supplier_id | INT | FOREIGN KEY REFERENCES suppliers(id), NOT NULL |
| bill_number | VARCHAR(100) | NOT NULL, UNIQUE per supplier |
| date | DATE | NOT NULL |
| purchase_amount | DECIMAL(15,2) | NOT NULL (initial balance) |
| balance | DECIMAL(15,2) | NOT NULL, DEFAULT = purchase_amount (updated on settlements) |
| gst | VARCHAR(50) | NULL |
| description | TEXT | NULL |
| is_closed | BOOLEAN | DEFAULT FALSE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

#### 3. supplier_settlements
| Column Name | Data Type | Constraints/Description |
|-------------|-----------|-------------------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| bill_id | INT | FOREIGN KEY REFERENCES supplier_bills(id), NOT NULL |
| settlement_amount | DECIMAL(15,2) | NOT NULL |
| date | DATE | NOT NULL |
| description | TEXT | NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Notes**: Balance in `supplier_bills` updated on settlements (subtract `settlement_amount`). Use app logic/triggers. For reports: JOIN on dates for filtering/pagination.

### Customer Tables

#### 1. customers
| Column Name | Data Type | Constraints/Description |
|-------------|-----------|-------------------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL, UNIQUE (for auto-suggest) |
| phone_number | VARCHAR(20) | NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

#### 2. customer_bills
| Column Name | Data Type | Constraints/Description |
|-------------|-----------|-------------------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| customer_id | INT | FOREIGN KEY REFERENCES customers(id), NOT NULL |
| bill_number | VARCHAR(100) | NOT NULL, UNIQUE per customer |
| date | DATE | NOT NULL |
| purchase_amount | DECIMAL(15,2) | NOT NULL |
| gst | VARCHAR(50) | NULL |
| description | TEXT | NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

#### 3. customer_payments
| Column Name | Data Type | Constraints/Description |
|-------------|-----------|-------------------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| customer_id | INT | FOREIGN KEY REFERENCES customers(id), NOT NULL |
| payment_amount | DECIMAL(15,2) | NOT NULL |
| date | DATE | NOT NULL |
| description | TEXT | NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Notes**: No per-bill balance (per-customer total via query: SUM(purchase_amount) - SUM(payment_amount)). For reports: Aggregate by date/customer for filtering/pagination/export. Add indexes on `date` for efficiency.