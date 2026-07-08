# Functional Requirements

## 1. Overview

This document defines the functional behavior of the Employee Salary Management System (ESMS). It describes the capabilities available to the HR Manager, the business rules governing employee and salary management, and the expected behavior of the system.

The application is designed for a single HR Manager responsible for maintaining salary information for approximately 10,000 employees across multiple countries.

---

# 2. Dashboard

The dashboard provides an overview of the organization's workforce and compensation.

## Features

The dashboard shall display:

- Total Employees
- Active Employees
- Inactive Employees
- Total Payroll
- Average Salary
- Highest Salary
- Lowest Salary

Additionally, the dashboard shall display:

- Payroll by Department
- Payroll by Country
- Employees by Department
- Recent Salary Revisions

The dashboard is read-only.

---

# 3. Employee Management

## View Employees

The HR Manager shall be able to:

- View all employees
- View employee details
- Search employees
- Filter employees
- Sort employees
- Paginate employee records

---

## Create Employee

The HR Manager shall be able to create a new employee.

The following information is required:

- Employee Code
- First Name
- Last Name
- Email
- Gender
- Department
- Designation
- Employment Type
- Joining Date
- Country
- Work Location
- Manager (optional)
- Initial Salary
- Salary Currency
- Effective Date

When an employee is created:

- A new Employee record shall be created.
- The initial Salary History record shall also be created.
- Both operations shall execute within a single database transaction.

---

## Update Employee

The HR Manager shall be able to update employee information.

Editable fields:

- First Name
- Last Name
- Email
- Department
- Designation
- Employment Type
- Country
- Work Location
- Manager

The following fields cannot be modified:

- Employee Code
- Joining Date

Salary updates are handled separately.

---

## Deactivate Employee

Employees shall not be permanently deleted.

Instead:

- Employment Status shall become INACTIVE.
- Historical salary records shall remain available.

Inactive employees shall be excluded from default employee listings while remaining available through filters.

---

# 4. Salary Management

Salary records are immutable.

A salary record cannot be edited or deleted.

---

## View Salary History

The HR Manager shall be able to view:

- Current Salary
- Complete Salary History
- Effective Dates
- Revision Reasons

Salary history shall be displayed in chronological order.

---

## Add Salary Revision

The HR Manager shall be able to create a new salary revision.

Required fields:

- Salary
- Currency
- Effective Date
- Revision Reason

When a salary revision is created:

- A new Salary History record shall be inserted.
- Existing salary records shall remain unchanged.

The latest effective salary becomes the employee's current salary.

---

# 5. Search

The HR Manager shall be able to search employees by:

- Employee Code
- Name
- Email

Search shall support partial matching.

---

# 6. Filtering

Employees can be filtered by:

- Department
- Country
- Employment Type
- Employment Status
- Manager

Filters may be combined.

---

# 7. Sorting

Employee listings shall support sorting by:

- Name
- Joining Date
- Department
- Country
- Current Salary

Ascending and descending order shall be supported.

---

# 8. Pagination

Employee listings shall support server-side pagination.

Default page size:

20 records.

Supported page sizes:

- 20
- 50
- 100

---

# 9. Analytics

The application shall provide salary insights including:

- Total Payroll
- Average Salary
- Highest Salary
- Lowest Salary
- Payroll by Department
- Payroll by Country
- Average Salary by Department
- Average Salary by Country
- Salary Distribution
- Employees by Department
- Employees by Country

Analytics shall be calculated using each employee's latest salary record.

---

# 10. Validation Rules

## Employee

- Employee Code must be unique.
- Email must be unique.
- Required fields cannot be empty.
- Joining Date cannot be in the future.

---

## Salary

- Salary must be greater than zero.
- Currency is required.
- Effective Date is required.
- Effective Date cannot precede Joining Date.

---

# 11. Business Rules

The system shall enforce the following business rules:

- Every employee must have at least one salary record.
- Salary history is immutable.
- Employees are soft deleted.
- Current salary is determined by the latest effective salary.
- Every salary revision creates a new Salary History record.
- Employee creation and initial salary creation must occur within a single transaction.

---

# 12. Error Handling

The system shall return meaningful error messages for:

- Validation failures
- Duplicate Employee Code
- Duplicate Email
- Employee not found
- Salary not found
- Invalid filters
- Invalid pagination parameters

---

# 13. Acceptance Criteria

The system shall be considered functionally complete when:

- Employees can be created, viewed, updated and deactivated.
- Salary history is preserved.
- New salary revisions create immutable history records.
- Dashboard metrics are displayed correctly.
- Analytics are generated from current salary data.
- Search, filtering, sorting and pagination function correctly.
- The application performs efficiently with approximately 10,000 seeded employees.
