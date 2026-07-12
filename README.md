# Employee Salary Management System

A full-stack, modular web application designed for HR managers to register employees, process salary revisions, and visualize payroll distribution charts.

## Project Structure

```
├── backend/            # Express API, Sequelize models, migrations, & seeders
│   ├── src/
│   │   ├── config/     # Database and logger setups
│   │   ├── migrations/ # Standalone schema migrations
│   │   ├── models/     # Sequelize database models
│   │   ├── modules/    # Modular Controller-Service-Repository architectures
│   │   └── seeders/    # DB seeders (seeds 10,000 employees & histories)
│   └── database.sqlite # SQLite database file
│
├── frontend/           # Vite React client
│   ├── src/
│   │   ├── components/ # Dashboard tabs and components
│   │   └── api.js      # Fetch wrapper with Vite proxy configurations
│   └── vite.config.js  # Vite server configurations
│
└── docs/               # Architecture and design documents
```

---

## Quick Start Guide

You can spin up the full application locally in under 5 minutes:

### 1. Backend Setup
1. Navigate to the `backend` directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Run database migrations to construct the tables and indexes:
   ```bash
   npx sequelize-cli db:migrate
   ```
3. Seed the database with 10,000 mock employee records:
   ```bash
   npm run db:seed
   ```
4. Run automated test suites:
   ```bash
   npm run test
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(Running on `http://localhost:3000`)*

### 2. Frontend Setup
1. Open a new terminal window, navigate to the `frontend` directory, and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend Vite development server:
   ```bash
   npm run dev
   ```
   *(Running on `http://localhost:5173` or `5174`)*

3. Open the displayed local URL in your browser to view the dashboard!

---

## Architectural Principles

1. **Modular Migrations**: Separates table creations chronologically to establish foreign keys without utilizing circular ALTER statements.
2. **Service-Based Pattern**: Controllers only direct requests and format JSON; all transactional query assemblies and business workflows are isolated inside reusable service classes.
3. **Database Performance**: Query executions are optimized using targeted database indexes (e.g. indexes on lookup foreign keys and compound indexes on salary history dates).
4. **CORS Isolation**: Implements Vite proxy settings to pipe local frontend API requests natively, avoiding browser preflight blocks.