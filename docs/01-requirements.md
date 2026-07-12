# Employee Salary Management System (ESMS)

## 1. Overview

ACME Organization currently manages salary information for approximately 10,000 employees across multiple countries using spreadsheets. As the organization grows, maintaining salary data in Excel has become time-consuming, error-prone, and difficult to analyze.

The objective of this project is to build a web-based Employee Salary Management System (ESMS) that enables HR Managers to efficiently manage employee salary information, maintain historical salary records, and gain meaningful insights into organizational compensation through dashboards and reporting.

This application is designed as a high-performance web dashboard that focuses on salary management and reporting while providing a clean, maintainable, and scalable architecture.

---

## 2. Goal

Develop a production-quality web application that allows HR Managers to:

- Manage employee salary information (with dynamic lookup bindings).
- Track salary revisions over time.
- Search and filter employee records with high responsiveness.
- View payroll analytics and salary insights.
- Answer common questions regarding employee compensation through reports and analytics.

---

## 3. Primary User

**HR Manager**

The HR Manager is responsible for maintaining salary information, reviewing employee compensation, and generating organizational salary insights.

---

## 4. In Scope

The MVP includes the following capabilities:

### Employee Management

- View employees.
- Add employees (with auto-derived country currencies and work locations).
- Update employee information (with manager assignment validations).
- Soft delete / deactivate employees.
- Search, filter, and paginate employee records dynamically.

### Salary Management

- Maintain current salary.
- Preserve complete salary history.
- Record salary effective dates.
- Prevent overwriting historical salary data (salary history is append-only).
- Lock salary currency to the country's local currency.

### Dashboard & Analytics

- Headcount metrics (Total, Active, Inactive).
- Financial metrics (Total Payroll in Crores/Lakhs, Average Salary).
- Chart views (Payroll by Department, Salary distribution breakdown, Country distribution).

---

## 5. Out of Scope

The following features are intentionally excluded from this MVP:

- Automatic payroll processing & disbursal.
- Tax calculations.
- Bonus and allowance management.
- Employee attendance & Leave management.
- Authentication & multi-tenant tenancy.
- Role-based access control (RBAC).
- Excel import/export.
- Multi-step approval workflows.
- Notifications & Audit logging.

---

## 6. Assumptions

- The application is used by a single HR Manager.
- Employee salaries are stored in their local currency.
- Salary history is immutable once recorded.
- Only base salary is managed.
- Employees belong to a single department and country.
- Seed data contains approximately 10,000 employees.

---

## 7. Success Criteria

- HR Manager can efficiently manage employee salary information.
- Complete salary history is preserved.
- Fast pagination and filtering across 10,000 records.
- UI elements auto-bind to database lookups dynamically.

---

## 8. Design Principles

- Simplicity over unnecessary complexity.
- Clean and maintainable Controller-Service-Repository architecture.
- Scalable data model with database-level indexes.
- Production-quality code with comprehensive styling and UI feedback.
