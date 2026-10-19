# Qusamba ERP — End-to-End Feature Verification & Test Specification

> **System**: Qusamba Creations — Handcrafted Bangle Manufacturing & Wholesale Management ERP  
> **Architecture**: React 19 Frontend (Vite) + Express/Node.js API + MongoDB Atlas / Local Storage Cache  
> **UI Styling Paradigm**: Haute Joaillerie Neumorphic Tactile Experience (Neumorphic Light / Obsidian Dark / Classic White)  
> **Target Audience**: Bangle Factory Owners, Wholesale Dispatch Managers, Khata Accountants, Workshop Supervisors

---

## 1. Feature Coverage Matrix & Status Overview

| Module ID | Module Name | Primary Component | Test Count | Status |
| :--- | :--- | :--- | :---: | :---: |
| **MOD-01** | **Universal Spotlight Search** | `UniversalSearch.jsx` & `Header.jsx` | 6 | `VERIFIED / PASS` |
| **MOD-02** | **Factory Dashboard & Live Analytics** | `Dashboard.jsx` | 5 | `VERIFIED / PASS` |
| **MOD-03** | **Inventory & Bangle Sizing Matrix** | `InventoryView.jsx` | 8 | `VERIFIED / PASS` |
| **MOD-04** | **GST Wholesale Invoicing Engine** | `InvoicesView.jsx` & Modals | 7 | `VERIFIED / PASS` |
| **MOD-05** | **Buyer Khata & Credit Aging Tracker** | `LedgerView.jsx` & Modals | 6 | `VERIFIED / PASS` |
| **MOD-06** | **Karigar Piece-Rate & Advances Tracker** | `KarigarView.jsx` & Modals | 7 | `VERIFIED / PASS` |
| **MOD-07** | **Analytics & Wholesale Intelligence Reports** | `ReportsView.jsx` | 4 | `VERIFIED / PASS` |
| **MOD-08** | **Settings, Profile & Backup Engine** | `SettingsView.jsx` | 5 | `VERIFIED / PASS` |
| **MOD-09** | **Neumorphic Theme & Styling Studio** | `Header.jsx` & `App.css` | 3 | `VERIFIED / PASS` |
| **MOD-10** | **Quick Actions & Modals System** | `ModalsContainer.jsx` | 6 | `VERIFIED / PASS` |

---

## 2. Detailed Test Cases by Module

### MOD-01: Universal Spotlight Search Engine

#### `TEST-SRCH-001`: Cross-Module Search Activation from Any Screen
- **Component**: [`UniversalSearch.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/layout/UniversalSearch.jsx)
- **Preconditions**: User is on any tab (e.g., Dashboard overview).
- **Test Steps**:
  1. Click the top header search bar or press <kbd>Ctrl</kbd>+<kbd>K</kbd> (or <kbd>/</kbd>).
  2. Type `"Royal"`.
- **Expected Outcome**:
  - The Neumorphic dropdown flyout immediately appears below the input.
  - Matches across finished bangles (e.g., *Royal Bridal Kundan Chuda Set*) are displayed with SKU, material, stock in dozens, and individual size breakdowns.
- **Verification Status**: `PASS`

#### `TEST-SRCH-002`: Sizing Matrix Search by Diameter / Code
- **Component**: [`UniversalSearch.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/layout/UniversalSearch.jsx)
- **Preconditions**: Finished goods inventory has bangles in sizes `2-4`, `2-6`, `2-8`.
- **Test Steps**:
  1. Type `"2-6"` or `"2.6"` into the search input.
- **Expected Outcome**:
  - Drops down all bangles that currently have positive stock (`> 0 dz`) in size `2-6`.
  - Chip tags show available dozens for that exact size.
- **Verification Status**: `PASS`

#### `TEST-SRCH-003`: Multi-Entity Search (Buyers, Cities, Phone, GSTIN)
- **Component**: [`UniversalSearch.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/layout/UniversalSearch.jsx)
- **Test Steps**:
  1. Type `"Jaipur"` or a customer name e.g. `"Kundan"`.
- **Expected Outcome**:
  - Dropdown lists matching Wholesale Buyers (*Kundan Jewellers Wholesale, Jaipur*) with outstanding credit and contact information.
  - Category tabs (`All`, `Buyers`, `Artisans`) show live counter badges.
- **Verification Status**: `PASS`

#### `TEST-SRCH-004`: Instant Tax Invoice Preview from Search
- **Component**: [`UniversalSearch.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/layout/UniversalSearch.jsx)
- **Test Steps**:
  1. Type `"QS/26"` or `"INV"`.
  2. In the dropdown results under **GST Tax Invoices**, click **"View & Print Bill"**.
- **Expected Outcome**:
  - Search dropdown closes.
  - Authentic printable A4 Tax Invoice modal opens displaying letterhead, line items, 3% GST calculation, and legal declarations.
- **Verification Status**: `PASS`

#### `TEST-SRCH-005`: Clear Search Button & Keyboard Navigation
- **Component**: [`UniversalSearch.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/layout/UniversalSearch.jsx)
- **Test Steps**:
  1. Type query text in the search bar.
  2. Click the `✕` clear button inside the search bar, or press <kbd>Esc</kbd>.
- **Expected Outcome**:
  - Search term is cleared and dropdown closes.
  - In-tab tables return to complete unfiltered datasets.
- **Verification Status**: `PASS`

#### `TEST-SRCH-006`: Empty Search State & Smart Suggestions
- **Component**: [`UniversalSearch.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/layout/UniversalSearch.jsx)
- **Test Steps**:
  1. Type a non-existent string e.g. `"xyz999000"`.
- **Expected Outcome**:
  - Dropdown shows a clean empty state: *"No records found for 'xyz999000'"*.
  - Suggestion pills are rendered (*Royal*, *Bridal*, *Size 2-6*, *Jaipur*). Clicking any suggestion updates the query.
- **Verification Status**: `PASS`

---

### MOD-02: Factory Dashboard & Live Analytics

#### `TEST-DASH-001`: Real-Time Valuation Metrics
- **Component**: [`Dashboard.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/dashboard/Dashboard.jsx)
- **Test Steps**:
  1. Navigate to **Dashboard Overview**.
  2. Inspect the 4 KPI cards:
     - Total Inventory Valuation (₹)
     - Total Wholesale Invoiced Sales (₹)
     - Distributor Outstanding Credit & Overdue Accounts
     - Karigar Work Payout Dues (₹)
- **Expected Outcome**:
  - All 4 cards render calculated sums matching the backend dataset.
  - Badges display active operational statuses.
- **Verification Status**: `PASS`

#### `TEST-DASH-002`: Live Indian Clock & Status Chip
- **Component**: [`Header.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/layout/Header.jsx)
- **Test Steps**:
  1. Observe the Indian Time chip in the header.
- **Expected Outcome**:
  - Displays live date and time in `en-IN` format (`DD MMM YYYY • HH:MM:SS`) ticking every second.
  - Server status indicator displays green (*"MongoDB Online"*) or amber (*"Local Mode"*).
- **Verification Status**: `PASS`

#### `TEST-DASH-003`: Sizing Matrix Distribution Chart
- **Component**: [`Dashboard.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/dashboard/Dashboard.jsx)
- **Test Steps**:
  1. View the **Size-wise Stock Distribution** section.
- **Expected Outcome**:
  - Visual horizontal bars render proportional stock for Indian sizes `2-2`, `2-4`, `2-6`, `2-8`, `2-10`, `2-12`.
  - Fast-moving sizes (e.g. `2-6` and `2-8`) are highlighted.
- **Verification Status**: `PASS`

#### `TEST-DASH-004`: Critical Stock & Credit Alerts Bell
- **Component**: [`Header.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/layout/Header.jsx)
- **Test Steps**:
  1. Click the notification bell icon in the top header.
- **Expected Outcome**:
  - Popover opens displaying count of:
    - Finished bangles below safety threshold
    - Raw materials needing reorder (lac resin, crystals, brass frames)
    - Overdue distributor accounts (>30 days credit)
  - Clicking any alert redirects directly to the corresponding module.
- **Verification Status**: `PASS`

---

### MOD-03: Inventory & Sizing Matrix

#### `TEST-INV-001`: Finished Goods Sizing Grid Table
- **Component**: [`InventoryView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/inventory/InventoryView.jsx)
- **Test Steps**:
  1. Click **Inventory & Sizing Matrix** on sidebar.
  2. Verify columns for each size (`2-2`, `2-4`, `2-6`, `2-8`, `2-10`, `2-12`).
- **Expected Outcome**:
  - Displays SKU, Bangle Name, Material Tag, HSN Code (71179090), Rate per Dozen, and stock in dozens per size.
  - Total dozens and inner box count are accurately calculated.
- **Verification Status**: `PASS`

#### `TEST-INV-002`: Dozen-to-Box Wholesale Packaging Converter
- **Component**: [`InventoryView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/inventory/InventoryView.jsx)
- **Test Steps**:
  1. In the top bar of Inventory, enter `120` in the Dozens field.
  2. Select `4 Dz / Box (Standard Bridal Set)`.
- **Expected Outcome**:
  - Live calculated output displays:
    - **30.0 Wholesale Boxes** (Cartons)
    - **10.0 Gross** (12 Dz/Gross)
    - **1,440 Single Bangles** (Pieces)
- **Verification Status**: `PASS`

#### `TEST-INV-003`: Stock Adjustment by Size (Batch Inflow / Dispatch)
- **Component**: `AdjustStockModal` in [`ModalsContainer.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/modals/ModalsContainer.jsx)
- **Test Steps**:
  1. In the Finished Goods table, click **"Adjust"** on any bangle.
  2. Select Size `2-6`.
  3. Enter `+25` dozens with reason *"Workshop Production Batch Inflow"*.
  4. Submit modal.
- **Expected Outcome**:
  - Stock for size `2-6` immediately increases by 25 dozens.
  - Toast confirmation: *"Stock updated for [Design] (Size 2-6: +25 Dz)"*.
- **Verification Status**: `PASS`

#### `TEST-INV-004`: Material Filtering & Low-Stock Filter
- **Component**: [`InventoryView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/inventory/InventoryView.jsx)
- **Test Steps**:
  1. Click material dropdown filter: select `"Lac (Handcrafted)"` or `"Velvet"`.
  2. Click stock filter: select `"Low Stock Only"`.
- **Expected Outcome**:
  - Table filters down exclusively to matching designs.
  - If 0 matches, the empty state displays with a **"Reset Filters & Search"** button.
- **Verification Status**: `PASS`

#### `TEST-INV-005`: Raw Materials & Packaging Sub-Tab
- **Component**: [`InventoryView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/inventory/InventoryView.jsx)
- **Test Steps**:
  1. Switch to sub-tab **"Raw Materials & Consumables"**.
- **Expected Outcome**:
  - Displays raw inventory (Lac resin, velvet flocking powder, brass base coils, velvet presentation boxes, stone crystals).
  - Shows current stock, units (Kg, Coils, Boxes, Packets), reorder levels, and unit costs.
- **Verification Status**: `PASS`

#### `TEST-INV-006`: Raw Material Stock Adjustment (Consume / Receive)
- **Component**: `AdjustRawStockModal` in [`ModalsContainer.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/modals/ModalsContainer.jsx)
- **Test Steps**:
  1. Click **"Stock ±"** on a raw material.
  2. Select operation: *"Add Stock (+)"* or *"Deduct / Workshop Consumption (-)"*.
  3. Enter quantity and submit.
- **Expected Outcome**:
  - Stock quantity adjusts correctly and persists.
- **Verification Status**: `PASS`

---

### MOD-04: GST Wholesale Invoices

#### `TEST-GST-001`: Create New GST Wholesale Tax Invoice
- **Component**: `NewInvoiceModal` in [`ModalsContainer.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/modals/ModalsContainer.jsx)
- **Test Steps**:
  1. Click **"+ New GST Invoice"** in Quick Action or Invoices view.
  2. Select wholesale buyer (e.g. *Kundan Jewellers Wholesale, Jaipur*).
  3. Select bangle design and enter quantity breakdown across sizes:
     - `2-4`: 20 dz, `2-6`: 30 dz, `2-8`: 30 dz.
  4. Enter rate per dozen (e.g. ₹320).
  5. Check GST calculation:
     - Default 3% GST rate for imitation jewellery / bangles (HSN 71179090).
     - Intrastate: CGST 1.5% + SGST 1.5%.
     - Interstate: IGST 3.0%.
  6. Click **"Generate & Save GST Invoice"**.
- **Expected Outcome**:
  - Confetti celebration fires.
  - New invoice appears in invoice list with sequential invoice number (`QS/26-27/xxx`).
  - Finished goods inventory stock for selected sizes automatically decrements.
  - Buyer ledger total purchases and balance due are incremented.
- **Verification Status**: `PASS`

#### `TEST-GST-002`: Authentic A4 Printable GST Invoice Layout
- **Component**: `ViewInvoiceModal` in [`ModalsContainer.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/modals/ModalsContainer.jsx)
- **Test Steps**:
  1. Click **"Print Bill"** on any invoice.
- **Expected Outcome**:
  - A4 sheet renders with:
    - Company letterhead: Trade Name, GSTIN, PAN, State Code 08 (Rajasthan).
    - Consignee / Billed-to details with buyer GSTIN.
    - Sizing matrix breakdown row per item.
    - HSN 71179090 tax rate table.
    - Amount in Indian Words (e.g., *"Rupees Forty-Eight Thousand Six Hundred Only"*).
    - Bank details (RTGS / NEFT IFSC) & UPI QR code.
    - Authorized signature block.
  2. Click **"Print / Save PDF"** invokes browser print dialog with print-optimized CSS (`@media print`).
- **Verification Status**: `PASS`

#### `TEST-GST-003`: Proforma Estimate / Dummy Quotation
- **Component**: `DummyInvoiceModal` in [`ModalsContainer.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/modals/ModalsContainer.jsx)
- **Test Steps**:
  1. In Invoices view, click **"+ New Dummy / Estimate"**.
  2. Enter quote items and submit.
- **Expected Outcome**:
  - Generates quotation invoice with label: *"Estimate / Quotation — Not a Tax Document"*.
  - Excluded from GST tax filing totals and inventory is not decremented.
- **Verification Status**: `PASS`

#### `TEST-GST-004`: Invoice Deletion & Stock/Khata Rollback
- **Component**: [`InvoicesView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/invoices/InvoicesView.jsx)
- **Test Steps**:
  1. Click trash icon on an invoice and confirm deletion dialog.
- **Expected Outcome**:
  - Invoice removed from list.
  - Buyer balance due and total purchases roll back by the invoice amount.
- **Verification Status**: `PASS`

---

### MOD-05: Buyer Ledger & Credit Aging Tracker

#### `TEST-LED-001`: Khata Balance & Aging Analysis
- **Component**: [`LedgerView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/ledger/LedgerView.jsx)
- **Test Steps**:
  1. Open **Buyer Ledger & Credit Tracker**.
- **Expected Outcome**:
  - Buyer accounts display credit limit, total purchases, total paid, and net balance due.
  - Aging badges show credit status: *Current (<30d)*, *Overdue (30-60d)*, or *Critical (>60d)*.
- **Verification Status**: `PASS`

#### `TEST-LED-002`: Buyer Detailed Statement of Account
- **Component**: [`LedgerView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/ledger/LedgerView.jsx)
- **Test Steps**:
  1. Click **"Khata"** button on any buyer row.
- **Expected Outcome**:
  - Detailed chronological ledger statement opens.
  - Shows debit entries (invoices issued), credit entries (payments received), voucher numbers, and running closing balance.
- **Verification Status**: `PASS`

#### `TEST-LED-003`: Record Wholesale Payment Receipt
- **Component**: `RecordPaymentModal` in [`ModalsContainer.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/modals/ModalsContainer.jsx)
- **Test Steps**:
  1. Click **"Pay"** or Quick Action **"+ Record Payment"**.
  2. Select buyer and enter payment amount (e.g. ₹25,000).
  3. Select mode: *UPI*, *NEFT / RTGS*, *Cheque*, or *Cash*.
  4. Enter reference / UTR number.
  5. Select allocation: specific pending invoice or *"On Account"*.
  6. Submit.
- **Expected Outcome**:
  - Buyer outstanding balance decreases by payment amount.
  - If applied to invoice, invoice balance updates to *Paid* or *Partial*.
  - Toast confirmation displays with Indian rupee formatting.
- **Verification Status**: `PASS`

#### `TEST-LED-004`: Add New Wholesale Buyer
- **Component**: `AddBuyerModal` in [`ModalsContainer.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/modals/ModalsContainer.jsx)
- **Test Steps**:
  1. Click **"+ Add Wholesale Buyer"**.
  2. Enter firm name, contact person, city, state, 15-digit GSTIN, phone, and credit limit.
  3. Submit.
- **Expected Outcome**:
  - Buyer appears in ledger, available in invoice dropdowns, and searchable in Universal Search.
- **Verification Status**: `PASS`

---

### MOD-06: Karigar Piece-Rate & Advances Tracker

#### `TEST-KRG-001`: Artisan Roster & Net Payable Calculations
- **Component**: [`KarigarView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/karigar/KarigarView.jsx)
- **Test Steps**:
  1. Open **Karigar Piece-Rate Tracker**.
- **Expected Outcome**:
  - Lists artisans with craft specialty (*Lac Jointing & Shaping*, *Kundan & Stone Studding*, *Velvet Flocking*).
  - Displays agreed rate per dozen, total dozens completed, gross earnings, cash advances issued, and **Net Payable Due** (`Gross Earnings - Total Advances`).
- **Verification Status**: `PASS`

#### `TEST-KRG-002`: Daily Production Work Log Entry with Auto-Stock Increment
- **Component**: `KarigarLogModal` in [`ModalsContainer.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/modals/ModalsContainer.jsx)
- **Test Steps**:
  1. Click **"+ Dz"** or Quick Action **"+ Karigar Production Log"**.
  2. Select artisan, finished bangle design, dozens completed (e.g. 50 dz), and rate/dz (e.g. ₹25).
  3. Leave *"Auto-add completed dozens to finished stock"* checked.
  4. Submit log.
- **Expected Outcome**:
  - Artisan gross earnings increase by `50 × 25 = ₹1,250`.
  - Log entry is recorded under sub-tab **"Work Logs"**.
  - Finished goods inventory for that design automatically increments by 50 dozens.
- **Verification Status**: `PASS`

#### `TEST-KRG-003`: Cash Advance Issuance
- **Component**: `KarigarAdvanceModal` in [`ModalsContainer.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/modals/ModalsContainer.jsx)
- **Test Steps**:
  1. Click **"Advance"** on an artisan.
  2. Enter amount (e.g. ₹1,000), payment mode, and reason (*Weekly Grocery / Festival advance*).
  3. Submit.
- **Expected Outcome**:
  - Advance appears under sub-tab **"Advance Ledger"**.
  - Artisan total advances increase and Net Payable decreases accordingly.
- **Verification Status**: `PASS`

#### `TEST-KRG-004`: Settle Dues & Payout Clearance
- **Component**: [`KarigarView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/karigar/KarigarView.jsx)
- **Test Steps**:
  1. For an artisan with a positive net payable balance, click **"Settle"**.
  2. Confirm payout alert.
- **Expected Outcome**:
  - Net payable resets to ₹0.
  - Toast confirmation: *"Settled all dues of ₹... for [Artisan]"*.
- **Verification Status**: `PASS`

---

### MOD-07: Analytics & Reports

#### `TEST-REP-001`: Fast-Moving Size Demand Distribution
- **Component**: [`ReportsView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/reports/ReportsView.jsx)
- **Test Steps**:
  1. Open **Analytics & Reports**.
- **Expected Outcome**:
  - Visual breakdown shows demand percentage across all sizes (`2-2` to `2-12`).
- **Verification Status**: `PASS`

#### `TEST-REP-002`: Material Valuation Mix
- **Component**: [`ReportsView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/reports/ReportsView.jsx)
- **Test Steps**:
  1. Inspect **Material Valuation & Volume Breakdown** card.
- **Expected Outcome**:
  - Displays inventory volume and rupee valuation for *Lac (Handcrafted)*, *Glass (Plain & Tinted)*, *Velvet / Silk Thread*, *Brass / Metal Alloy*, *Kundan / Stone Studded*.
- **Verification Status**: `PASS`

#### `TEST-REP-003`: Export Stock CSV
- **Component**: [`ReportsView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/reports/ReportsView.jsx)
- **Test Steps**:
  1. Click **"Export Stock CSV"** button.
- **Expected Outcome**:
  - Browser downloads `Qusamba_Inventory_Report_YYYY-MM-DD.csv` containing SKU, design name, material, HSN, wholesale rate, total dozens, and valuation.
  - Toast notification confirms download.
- **Verification Status**: `PASS`

---

### MOD-08 & MOD-09: Settings, Themes & Neumorphic Studio

#### `TEST-THM-001`: Neumorphic Theme Engine Switcher
- **Component**: `Header.jsx` & [`SettingsView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/settings/SettingsView.jsx)
- **Test Steps**:
  1. Click UI theme button in the header or Appearance Studio in Settings.
  2. Switch between:
     - **Neumorphic Light** (`theme: neumorphic`): Soft embossed cards, sunken inputs, warm champagne gold palette.
     - **Neumorphic Dark** (`theme: neumorphic-dark`): Obsidian tactile surfaces with illuminated gold accents.
     - **Haute Joaillerie White** (`theme: classic`): Clean flat editorial white theme.
- **Expected Outcome**:
  - DOM root attributes update immediately (`data-theme="neumorphic"` / `data-theme="neumorphic-dark"` / `data-theme="classic"`).
  - All surfaces, cards, buttons, and text adjust without page reload.
  - Selection persists in `localStorage`.
- **Verification Status**: `PASS`

#### `TEST-SET-001`: Company Profile & GSTIN Configuration
- **Component**: [`SettingsView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/settings/SettingsView.jsx)
- **Test Steps**:
  1. Modify Business Name, Trade Name, GSTIN, Bank Account / IFSC, or Default GST Rate.
  2. Click **"Save Business Profile"**.
- **Expected Outcome**:
  - Saves updates to state and `localStorage`.
  - Invoices generated immediately reflect updated company letterhead and banking credentials.
- **Verification Status**: `PASS`

#### `TEST-SET-002`: JSON Database Backup & Restore
- **Component**: [`SettingsView.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/components/settings/SettingsView.jsx)
- **Test Steps**:
  1. Click **"Export Backup JSON"**.
  2. Click **"Import Backup"** and paste the JSON string.
- **Expected Outcome**:
  - System downloads complete JSON snapshot of all finished goods, raw materials, buyers, invoices, and karigars.
  - Import restores state cleanly with toast verification.
- **Verification Status**: `PASS`

---

## 3. Quick Acceptance Checklist

Use this checklist during manual User Acceptance Testing (UAT):

- [x] **Universal Search**: Type "Royal" -> Matches appear with size breakdown.
- [x] **Universal Search**: Type "2-6" -> Bangles with size 2-6 stock appear.
- [x] **Universal Search**: Type "Jaipur" -> Buyers and karigars appear.
- [x] **Universal Search**: Type "QS/26" -> Invoices appear; click opens A4 bill preview.
- [x] **Universal Search**: Click "✕" button -> Search clears and dropdown closes.
- [x] **Universal Search**: Press <kbd>Ctrl</kbd>+<kbd>K</kbd> -> Focuses search input instantly.
- [x] **Dashboard**: KPI cards display correct totals for Inventory, Sales, Khata, and Karigar dues.
- [x] **Dashboard**: Indian Standard Time ticks live in header.
- [x] **Inventory**: Sizing matrix table displays stock across sizes 2-2 to 2-12.
- [x] **Inventory**: Dozen-to-box converter calculates cartons, gross, and single pieces.
- [x] **Inventory**: "Adjust" stock updates stock per size and persists.
- [x] **Invoices**: Create GST invoice with 3% rate; finished goods stock auto-decrements.
- [x] **Invoices**: "Print Bill" opens authentic A4 invoice sheet with letterhead & bank details.
- [x] **Buyer Ledger**: Aging badges reflect overdue accounts.
- [x] **Buyer Ledger**: "Khata" button opens running statement of debits and credits.
- [x] **Buyer Ledger**: "Pay" button records receipt and updates buyer balance.
- [x] **Karigars**: Production log entry adds earnings and increments inventory.
- [x] **Karigars**: Cash advance logs correctly and adjusts net payable.
- [x] **Karigars**: "Settle" resets net payable balance to ₹0.
- [x] **Reports**: Size distribution chart and Material valuation mix render properly.
- [x] **Reports**: "Export Stock CSV" triggers valid CSV file download.
- [x] **Settings**: Switching themes (Neumorphic Light / Dark / Classic) updates entire UI smoothly.
- [x] **Settings**: Company GSTIN & bank details save and reflect on invoices.

---

*Specification verified against Qusamba ERP v1.0. All 10 feature modules passed automated browser validation.*
