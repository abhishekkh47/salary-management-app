# System Design

## 1. Overview

The Employee Salary Management System (ESMS) is designed as a modern three-tier web application consisting of a React frontend, a RESTful backend, and a relational database.

The system is designed around the following principles:

- Separation of concerns
- Maintainability
- Scalability
- Testability
- Extensibility

Although the current requirement is to support approximately **10,000 employees**, the architecture is intentionally modular so that additional capabilities (authentication, payroll processing, approvals, etc.) can be added without major refactoring.

---

# 2. High-Level Architecture

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
|                     React Frontend (Next.js)                  |
|---------------------------------------------------------------|
| Dashboard                                                     |
| Employee Management                                           |
| Salary Management                                             |
| Analytics                                                     |
| Search & Filtering                                            |
+---------------------------+-----------------------------------+
                            |
                            |
                            ▼
+---------------------------------------------------------------+
|                     Backend API (Node.js)                     |
|---------------------------------------------------------------|
| Controllers                                                   |
| Business Services                                             |
| Validation                                                    |
| Repository Layer                                              |
+---------------------------+-----------------------------------+
                            |
                            |
                            ▼
+---------------------------------------------------------------+
|                  Relational Database (SQLite)                 |
|---------------------------------------------------------------|
| Employees                                                     |
| Salary History                                                |
| Departments                                                   |
| Countries                                                     |
+---------------------------------------------------------------+
```

---

# 3. Technology Stack


| Layer         | Technology                   |
| ------------- | ---------------------------- |
| Frontend      | Next.js + React              |
| UI Components | Material UI                  |
| Backend       | Node.js + Express            |
| ORM           | Sequelize                    |
| Database      | SQLite                       |
| Validation    | Joi                          |
| Testing       | Jest + React Testing Library |
| Charts        | Recharts                     |
| Seeding       | Faker.js                     |


---

# 4. Architecture Layers

The backend follows a layered architecture to improve maintainability and simplify testing.

```
HTTP Request

↓

Controller

↓

Service

↓

Repository

↓

Database
```

## Controller Layer

Responsibilities:

- Receive HTTP requests
- Validate request format
- Call business services
- Return API responses

Controllers contain no business logic.

---

## Service Layer

Contains all business logic.

Responsibilities include:

- Employee management
- Salary updates
- Salary history creation
- Analytics calculations
- Validation of business rules

This layer is the core of the application.

---

## Repository Layer

Responsible only for database operations.

Responsibilities:

- CRUD operations
- Query construction
- Data persistence
- Database abstraction

Using repositories allows the database implementation to change with minimal impact on business logic.

---

## Database Layer

Stores application data.

Responsibilities:

- Data integrity
- Constraints
- Relationships
- Indexing

---

# 5. Design Decisions

## Salary History

Instead of overwriting salaries, every salary update creates a new salary history record.

Benefits:

- Historical reporting
- Auditability
- Future payroll integration
- Better analytics

---

## Soft Delete

Employees are marked inactive instead of permanently deleted.

Benefits:

- Prevent accidental data loss
- Preserve historical salary records
- Improve reporting accuracy

---

## Server-side Pagination

Employee data is paginated on the backend.

Reason:

Loading 10,000 employees in a single request is inefficient and negatively impacts performance.

---

## RESTful APIs

The application exposes REST APIs with resource-oriented endpoints.

Example:

```
GET /employees

POST /employees

PATCH /employees/:id

GET /analytics
```

REST provides a familiar and maintainable interface suitable for the application's requirements.

---

# 6. Scalability Considerations

Although the assessment dataset contains approximately 10,000 employees, the following practices improve scalability:

- Server-side pagination
- Database indexing
- Efficient SQL queries
- Separation of business logic
- Modular architecture
- Reusable services

Future improvements may include:

- PostgreSQL
- Redis caching
- Background jobs
- Horizontal scaling
- Containerization

---

# 7. Error Handling

The API follows consistent HTTP status codes.


| Status | Meaning               |
| ------ | --------------------- |
| 200    | Success               |
| 201    | Resource Created      |
| 400    | Validation Error      |
| 404    | Resource Not Found    |
| 409    | Conflict              |
| 500    | Internal Server Error |


All errors return a consistent JSON response format.

Example:

```json
{
  "success": false,
  "message": "Employee not found"
}
```

---

# 8. Validation Strategy

Validation occurs at multiple layers.

Frontend:

- Required fields
- Basic form validation

Backend:

- Schema validation
- Business rule validation

Database:

- Constraints
- Foreign keys
- Unique indexes

This ensures invalid data cannot enter the system.

---

# 9. Security Considerations

Although authentication is outside the MVP scope, the application follows secure development practices.

These include:

- Input validation
- SQL injection prevention through Prisma
- Parameterized database queries
- Proper HTTP status codes
- Server-side validation

---

# 10. Performance Considerations

The system is designed to remain responsive while managing 10,000 employees.

Performance optimizations include:

- Pagination
- Indexed columns
- Lazy loading
- Optimized queries
- Efficient filtering
- Aggregation queries for analytics

---

# 11. Testing Strategy

Testing focuses primarily on business logic.

The project includes:

- Unit tests
- Service tests
- API tests
- Frontend component tests

Core business logic such as salary updates and analytics calculations will receive the highest test coverage.

---

# 12. Future Enhancements

Potential future improvements include:

- Authentication & Authorization
- Role-Based Access Control (RBAC)
- Payroll processing
- Tax calculations
- Bonus management
- Currency conversion
- Excel import/export
- Audit logs
- Notification system

