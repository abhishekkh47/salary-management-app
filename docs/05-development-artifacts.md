# Development Artifacts: Planning, Trade-offs & Notes

This document captures the planning notes, trade-offs, performance decisions, and prompts used during the development of the Employee Salary Management System.

---

## 1. Trade-off Explanations

### A. SQLite vs. Dedicated Server Database (PostgreSQL/MySQL)
* **Decision**: Kept the default **SQLite** database.
* **Trade-off**: While SQLite is single-threaded and lacks advanced concurrent writing optimizations, it is extremely lightweight, requires zero local service setup, and saves data to a local file (`database.sqlite`).
* **Why**: For a single HR Manager (single-user scenario) managing 10,000 employees, the database write throughput is low. SQLite easily handles 10,000 reads and transaction commits under 10ms, making it ideal for simplicity and speed in this MVP.

### B. Dynamic DB Lookups vs. Static Hardcoded Enums
* **Decision**: Extracted all dropdown options (Departments, Designations, Countries, Employment Types) into independent relational database tables.
* **Trade-off**: Requires database joins and additional lookup tables during initial query setups.
* **Why**: If a new country, designation, or department is added tomorrow, hardcoded code enums (both in React and Joi backend validators) would break or require a code redeployment. Dynamic database lookups future-proof the application, allowing the UI to auto-bind directly to the database state.

### C. CORS Bypass via Vite Proxy vs. Express CORS headers
* **Decision**: Routed API requests relative to the web origin and proxied them via Vite's development server to the backend.
* **Trade-off**: Requires configuration within `vite.config.js` for local development environments.
* **Why**: Modern browsers reject cross-origin requests (e.g. React on `localhost:5173` making `PATCH` requests to Express on `localhost:3000`) unless preflight options (`OPTIONS`) headers match perfectly. Development servers frequently hit CORS mismatches. Proxying turns cross-origin requests into same-origin requests from the browser's perspective, completely preventing CORS blockages.

---

## 2. Performance Considerations

### A. Database Indexing
To query 10,000+ employees with sub-second response times, we created targeted indexes:
* Indexes on foreign keys (`departmentId`, `designationId`, `countryId`, `employmentTypeId`) to optimize Sequelize `JOIN` performance when fetching listings.
* An index on `managerId` to speed up subordinate lookups.
* Index on `effectiveDate` inside `SalaryHistories` to sort the salary revision timelines quickly.

### B. Server-Side Pagination
* Loading 10,000 employees in React at once would cause significant memory overhead, slow DOM rendering, and high network payloads.
* We implemented server-side pagination (`limit = 10` by default), fetching only the current slice of records.

### C. Formatting Large Numbers (Lakhs and Crores)
* In the dashboard, values like `53500000` are formatted as `5.35 Cr` and `500000` as `5 L`. This prevents visual clutter on chart axes and KPI cards.

---

## 3. Planning & Design Notes

* **Self-Referential Manager Code Resolution**: Instead of asking users to input arbitrary primary key IDs (e.g. `23`) which they wouldn't know, we let them enter the 5-digit number corresponding to the manager's Employee Code (e.g. `00002` representing `EMP00002`). The backend dynamically resolves the `employeeCode` to the database integer primary key `id` during creation or updates.
* **Locked Currencies**: Salary currency is locked to the employee's country (e.g. registering an employee in India automatically assigns `INR`). We disabled the currency input field on the frontend and added a backend check validating that the salary currency matches the employee's country profile, guaranteeing data integrity.
* **Drawer Tab Navigation**: Replaced the long vertical drawer layout with tabs (Overview, Salary History, Direct Reports) to avoid vertical scroll overflows when employees have extensive history records or numerous subordinates.
