# System Design

## 1. Overview

The Employee Salary Management System (ESMS) is designed as a modern three-tier web application consisting of a React frontend, a RESTful backend, and a relational database.

The system is designed around the following principles:
- Separation of concerns
- Maintainability
- Scalability
- Testability
- Extensibility

The architecture is modular so that additional capabilities (authentication, payroll processing, approvals, etc.) can be added without major refactoring.

---

## 2. High-Level Architecture

```
                        +-------------------------+
                        |      HR Manager         |
                        +-----------+-------------+
                                    |
                                    |
                        HTTPS / REST API
                                    |
                                    ▼
+---------------------------------------------------------------+
|                     React Frontend (Vite)                     |
|---------------------------------------------------------------|
| Dashboard Tab                                                 |
| Employees Tab (Details Drawer with Tabbed view)               |
| Register Employee Tab                                         |
| API Wrapper (Vite CORS Proxying)                              |
+---------------------------+-----------------------------------+
                            |
                            |
                            ▼
+---------------------------------------------------------------+
|                     Backend API (Node.js)                     |
|---------------------------------------------------------------|
| Controllers (Response formatting helpers)                     |
| Services (Transactional business logic)                       |
| Validation (Joi Request schemas)                              |
| Repositories (Sequelize SQL queries)                          |
+---------------------------+-----------------------------------+
                            |
                            |
                            ▼
+---------------------------------------------------------------+
|                  Relational Database (SQLite)                 |
|---------------------------------------------------------------|
| Employees & Salary History                                    |
| Departments, Designations, Countries, Employment Types        |
+---------------------------------------------------------------+
```

---

## 3. Technology Stack

| Layer         | Technology                   |
| ------------- | ---------------------------- |
| Frontend      | Vite + React                 |
| UI Styling    | Custom Vanilla CSS           |
| Backend       | Node.js + Express            |
| ORM           | Sequelize                    |
| Database      | SQLite                       |
| Validation    | Joi                          |
| Charts        | Recharts                     |

---

## 4. Architecture Layers

The backend follows a layered architecture to improve maintainability and simplify testing.

```
HTTP Request → Controller → Service → Repository → Database
```

* **Controller**: Responsible for parsing request inputs, routing, and returning standard JSON payloads.
* **Service**: The orchestrator of business rules and transactions.
* **Repository**: Encapsulates DB-specific Sequelize queries.
* **Dependency Container**: Manages instantiation and dependency injection.

---

## 5. Frontend Organization

The React frontend utilizes a single-page layout separated into tabs:
1. **Dashboard**: High-level KPIs formatted in Lakhs/Crores and charts representing payroll distribution.
2. **Employees**: Table listing with paging, search, multi-filters, and profile drawer.
3. **Register Employee**: Form to register new employee.

Vite is configured with a dev server proxy targeting `http://localhost:3000` to bypass preflight requests and CORS configuration blocks during local development.

---

## 6. Testing Strategy

The backend includes comprehensive integration and unit tests built using Jest:
- **Database Engine**: Uses an in-memory SQLite database (`:memory:`) in the `test` environment to isolate tests and preserve speed.
- **Service Isolation**: Tests focus on business services (`employee.service`, `salary-history.service`, and `analytics.service`), making direct repository calls while mocking lookups.
- **Coverage**:
  - Employee creation transactional validation, self-manager restriction, and employeeCode/email duplication checks.
  - Salary revision validations enforcing locked country currencies.
  - Analytics calculations measuring active headcounts and converting multi-currency payroll logs into INR totals.
