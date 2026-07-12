# Salary Management Backend Service

A Node.js & Express RESTful API for employee registration, dynamic salary revisions, lookups, and payroll analytics. Built on a clean service-repository architectural pattern with Sequelize ORM and SQLite database.

## Architecture Guidelines

This project strictly adheres to a **Service-Repository** architectural pattern:
* **Models**: Define the database schemas using Sequelize (`src/models`).
* **Repositories**: Abstract direct database queries (`src/modules/[module]/[module].repository.js`).
* **Services**: Contain all core business logic and transactional orchestration (`src/modules/[module]/[module].service.js`).
* **Validators**: Validate request bodies using Joi schemas before hitting controllers (`src/modules/[module]/[module].validator.js`).
* **Controllers**: Receive requests, map parameters, invoke services, and format standard API responses using `BaseController` helpers (`src/modules/[module]/[module].controller.js`).
* **Dependency Container**: All services, controllers, and repositories are registered and instantiated inside `src/container/index.js` for clean dependency injection.

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
2. Configure environment variables in `.env` (copied from `.env.example` if it exists).

### Database Migrations and Seeding
Setting up database tables, indexes, lookup values, and 10,000 initial employee records is automated:

1. **Run Migrations**: Creates all lookup tables (departments, designations, countries, employment types) and relations (employees, salary histories) with optimized indexes.
   ```bash
   npx sequelize-cli db:migrate
   ```
2. **Seed Database**: Runs the seeder to populate 10,000 records dynamically using faker libraries:
   ```bash
   npm run db:seed
   ```

### Running Locally
To launch the backend server with hot-reloading (nodemon):
```bash
npm run dev
```
The server will start on port `3000` by default.

---

## API Endpoints Reference

### 1. Employees
* `GET /api/v1/employees` - Paginated and searchable list of employees (filters: `countryId`, `departmentId`, `designationId`, `employmentStatus`).
* `GET /api/v1/employees/:id` - Fetch detailed profile of a single employee with complete history and direct report list.
* `POST /api/v1/employees` - Register a new employee with initial salary record (performs dynamic manager lookup).
* `PATCH /api/v1/employees/:id` - Update employee details (blocks self-reporting circular manager references).
* `DELETE /api/v1/employees/:id` - Deactivate an employee record.

### 2. Salaries & Revisions
* `GET /api/v1/employees/:id/salary-history` - Fetch full history of salary revisions for a specific employee.
* `POST /api/v1/employees/:id/salary-history` - Add a new salary revision (automatically checks and locks to employee's country currency).

### 3. Analytics
* `GET /api/v1/analytics` - Fetch payroll dashboard KPIs (active headcount, total payroll cost, average salary, country breakdown, department breakdown, top earners).

### 4. Lookups
* `GET /api/v1/lookups` - Fetch dynamic lookup maps (departments, designations, countries, employment types) to populate forms.

---

## Running Tests

Automated testing is configured using Jest. The test runner uses an in-memory SQLite database automatically when running in the `test` environment to guarantee clean runs:

```bash
npm run test
```

Test suites cover:
* **Employee registration & updates**: Validations for code duplication, self-manager restriction, and transactional writes.
* **Salary revisions**: Currencies locking based on the employee's country profile.
* **Payroll analytics**: Multi-currency conversions, average base pay, and distribution aggregations.
