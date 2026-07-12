# Salary Management Frontend Client

A responsive, high-performance React dashboard built with Vite for managing employee profiles, processing salary revisions, and visualizing payroll distribution data.

## Features

* **Analytics Dashboard**: Dynamic metrics (Active Headcount, Total Payroll, Average Salary) with charts (Payroll by Department, Salary brackets pie chart, Country breakdowns) built using Recharts.
* **Employee Management**:
  * Paginated table listing with quick filters for country, department, designation, and employment status.
  * Search utility matching codes, names, or emails.
  * Side-drawer profile panel displaying overview details, salary timeline, and direct reports.
* **Dynamic Lookups**: Dropdowns, selectors, and filters load dynamically from database tables (adding new rows to the database automatically surfaces them in the UI).
* **Smart Validation Forms**:
  * Visual formatting prefixing for Employee Code inputs (`EMPXXXXX`).
  * Currency fields automatically lock and resolve based on selected countries.
  * Restricts invalid reporting configurations (e.g. preventing self-manager assignments).

---

## Getting Started

### Prerequisites
* Node.js (version 18 or above recommended)
* npm

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

### Development Server & Proxying
To run the client locally:
```bash
npm run dev
```
By default, Vite will start the development server on `http://localhost:5173` (or `5174` if busy).

#### CORS Bypass (Vite Proxy)
Vite is pre-configured with a dev proxy in `vite.config.js` to route all local `/api` calls directly to the backend server (`http://localhost:3000`). This ensures same-origin requests on the client side and completely avoids CORS preflight OPTIONS blocks:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true
    }
  }
}
```

---

## Tech Stack
* **Build System**: Vite (React)
* **Icons**: Lucide React
* **Data Visualization**: Recharts
* **Styling**: Vanilla CSS (sleek dark mode layout with custom components)
