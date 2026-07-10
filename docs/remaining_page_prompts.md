# Remaining page build prompts

Paste each block into the Lovable project chat once credits are restored. The
project already has the orange and white design system, the sidebar, and three
finished pages (Dashboard, Trade Analytics, Demand Forecast). The data for these
pages is in this repo under `/data`.

Project: https://lovable.dev/projects/26f36d35-b868-470e-9cc7-16a880f73d51

Rule for every prompt: never use the em dash character anywhere in any text.

---

## 1. Product Knowledge Base

Build the Product Knowledge Base page. Left column is a searchable product list
(name, HS code, small price chip). Right detail panel updates on selection,
default Paraxylene. Put data in `src/data/products.ts` from
`data/products_knowledge.json` in this repo.

Detail panel shows: header with name, HS code, CAS, plant type badge, indicative
price chip in orange; a numbered Manufacturing Route list; two small charts side
by side, a donut Cost Drivers and a horizontal bar End Use Industries; a Key
Manufacturers row of chips; a Pricing mini card with range and the line
"Trade based median from Datamyne, refine with ICIS or Platts quotations."

Use the five products in `data/products_knowledge.json`.

---

## 2. Clients (Buyers)

Build the Clients (Buyers) page. Data from `data/clients_buyers.json`.

Top: 3 KPI chips, Tracked Buyers 10, Total Buy Value USD 54.5M, Top Sector
Fertilisers. Filters for Sector and Status. A searchable, sortable table with
columns Company, Country, Primary Products, HS Codes, Sector, Import Value (USD),
Status. Status is a chip, Active in sample is orange, Prospect is gray. Add a
short note that buyers come from the Datamyne import sample and can be enriched
with DGFT IEC data.

---

## 3. Suppliers (Manufacturers)

Build the Suppliers (Manufacturers) page. Manufacturers only, no traders. Data
from `data/suppliers_manufacturers.json`.

Top: 3 KPI chips, Tracked Manufacturers 31, Countries 12, Recommended 13.
A product group selector (Phosphoric acid, Paraxylene, Styrene monomer, Methanol,
Benzene, Heterocyclic compounds). Filter by certification (ISO 9001, ISO 14001,
GMP, REACH). Show supplier cards in a grid, each with company name, country,
type, certification chips, capacity note, and a status chip (Recommended orange,
Active in sample light orange, Prospect gray). Add a note that certifications
should be verified against ISO, REACH, and FDA directories before engagement.

---

## 4. Documents

Build the Documents page. A clean upload area for PDF and Excel files with a
dashed drop zone, accepted types note (.pdf, .xlsx, .xls), and an "Upload" button
(front end only, no backend). Below it a sample "Recent Documents" table with
columns File, Type, Uploaded, Status. Rows: Datamyne_import_Feb2026.xlsx, Excel,
2026-06-18, Parsed; Supplier_COA_OCP.pdf, PDF, 2026-06-17, Parsed;
GMP_certificate_Anthem.pdf, PDF, 2026-06-15, In review. Add a short note that PDF
parsing uses pdfplumber or tabula and Excel uses a column mapping step.

---

## 5. Integrations

Build the Integrations page. Data from `data/integrations_catalog.json`. Show a
grid of integration cards grouped by category (Trade data, Chemical reference,
Pricing, Certification, Company data, Macro, Documents). Each card has the source
name, purpose, and a status chip (Connected orange, Available gray with a
"Connect" button). Add a header line "Room to add more databases as you grow."
