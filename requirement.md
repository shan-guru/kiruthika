# Small Web Application Requirements Spec

**Overview**: A simple web app for managing supplier credit purchases/settlements and customer credit purchases/payments in a small shop. Four main screens + Reports module. Data is stored persistently (e.g., in a database) to track balances and history. Fields are form inputs unless noted. Mandatory fields are marked with *

## Screen 1: Credit Purchase (Supplier)
**Purpose**: Log a new purchase from a supplier on credit (goods received, payment deferred).

### Fields (in order)
- **Name***: Text input with auto-suggest for existing suppliers; allows new entries.
- **Bill Number***: Free-text input.
- **Phone Number**: Optional text.
- **GST**: Optional text.
- **Date***: Date picker (default: today).
- **Purchase Amount***: Numeric input (e.g., 100000 for ₹1 lakh).
- **Description**: Optional textarea.

### Behavior on Generate
- Validate mandatory fields.
- Save as new credit record with initial balance = Purchase Amount.
- No payment deduction.

## Screen 2: Make Settlement (Supplier)
**Purpose**: Record a partial or full payment against an existing supplier credit purchase (installment).

### Fields (in order)
- **Name***: Text input with auto-suggest; only existing suppliers with open (unpaid) credit balances. No new entries allowed.
- **Bill Number***: Dropdown; populates only after valid Name selection, showing open bills for that supplier only.
- **Balance Amount (Label)**: Auto-filled numeric (read-only); calculated as Purchase Amount - (Sum of Settlement Amount against the chosen bill for the given supplier name). Auto-populates immediately after Bill Number selection.
- **Settlement Amount***: Numeric input (e.g., 20000 for first installment).
- **Date***: Date picker (default: today).
- **Description**: Optional textarea.

### Behavior on Submit
- Validate mandatory fields; ensure Settlement Amount ≤ Balance Amount.
- Subtract Settlement Amount from Balance Amount to update remaining balance.
- Save as settlement record linked to the bill.
- If balance reaches 0, mark bill as closed (remove from future dropdowns).

## Screen 3: Credit Purchase (Customer)
**Purpose**: Log a new sale to a customer on credit (goods/services provided, payment deferred).

### Fields (in order)
- **Name***: Text input with auto-suggest for existing customers; allows new entries.
- **Bill Number***: Free-text input.
- **Phone Number**: Optional text.
- **GST**: Optional text.
- **Date***: Date picker (default: today).
- **Purchase Amount***: Numeric input (e.g., 100000 for ₹1 lakh).
- **Description**: Optional textarea.

### Behavior on Submit
- Validate mandatory fields.
- Save as new credit record with initial balance = Purchase Amount.
- No payment deduction.

## Screen 4: Make Payment (Customer)
**Purpose**: Record a partial or full payment received from an existing customer credit purchase (installment).

### Fields (in order)
- **Name***: Text input with auto-suggest; only existing customers with open (unpaid) credit balances. No new entries allowed.
- **Balance Amount (Label)**: Auto-filled numeric (read-only); calculated as Purchase Amount - (Sum of Settlement Amount against the given customer name). Auto-calculates and displays immediately after Name selection.
- **Settlement Amount***: Numeric input (e.g., 20000 for first installment).
- **Date***: Date picker (default: today).
- **Description**: Optional textarea.

### Behavior on Submit
- Validate mandatory fields; ensure Settlement Amount ≤ Balance Amount.
- Subtract Settlement Amount from Balance Amount to update remaining balance.
- Save as payment record linked to the customer.
- If balance reaches 0, mark customer as settled (remove from future suggestions).

## Reports Module
**Purpose**: Generate filtered reports for suppliers or customers, showing transactions and balances within a date range. Exportable (e.g., PDF/CSV/Excel).

### Screen 5: Supplier Report
- **Fields** (in order):
  - **Supplier Name***: Text input with auto-suggest for all suppliers; if empty/no selection, report for all suppliers.
  - **Bill Number**: Optional text input (filters by specific bill).
  - **Start Date***: Date picker.
  - **End Date***: Date picker (must be ≥ Start Date).
- **Behavior on Generate**:
  - Filter purchases/settlements by date range, selected supplier (or all), and bill number (if provided).
  - Display table: Date, Bill Number, Purchase Amount, Settlement Amount, Balance (with pagination: 10-50 rows/page, next/prev buttons).
  - Totals: Total Purchases, Total Settlements, Outstanding Balance.
  - Export buttons: PDF, CSV, Excel.

### Screen 6: Customer Report
- **Fields** (in order):
  - **Customer Name***: Text input with auto-suggest for all customers; if empty/no selection, report for all customers.
  - **Start Date***: Date picker.
  - **End Date***: Date picker (must be ≥ Start Date).
- **Behavior on Generate**:
  - Filter purchases/payments by date range and selected customer (or all).
  - Display table: Date, Bill Number, Purchase Amount, Payment Amount, Balance (with pagination: 10-50 rows/page, next/prev buttons).
  - Totals: Total Sales, Total Payments, Outstanding Receivables.
  - Export buttons: PDF, CSV, Excel.

## General Notes
- **Navigation**: Simple menu to switch between screens/reports.
- **Validation**: Client-side for UX; server-side for security.
- **UI**: Basic form layout; mobile-friendly. Use tables for report display with pagination.
- **Future**: Expand as needed (e.g., all-supplier summary).