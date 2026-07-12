# Database Design

## 1. Overview

The Employee Salary Management System uses a relational SQLite database. The schema is normalized, extracting designations, departments, countries, and employment types into separate lookup tables. 

The design prioritizes:
- Data integrity
- Historical traceability
- Fast query performance using indexes
- Normalization

---

## 2. Entity Relationship Diagram

```
       +--------------+
       |   Country    |
       +-------+------+
               | (1)
               |
               | (Many)
       +-------▼------+               +-----------------+
       |   Employee   |◄─────────────┤  SalaryHistory  |
       +-------+------+ (1)    (Many)+-----------------+
               | (Many)
               |
               ▼ (1)
       +-------+------+
       |  Department  |
       +--------------+
```

---

## 3. Schema Definitions

### Lookup Tables

#### Countries
* `id` (INTEGER, PK, Auto-Increment)
* `name` (VARCHAR, Unique)
* `currency` (VARCHAR)
* `exchangeRate` (DECIMAL)

#### Departments
* `id` (INTEGER, PK, Auto-Increment)
* `name` (VARCHAR, Unique)

#### Designations
* `id` (INTEGER, PK, Auto-Increment)
* `title` (VARCHAR, Unique)

#### EmploymentTypes
* `id` (INTEGER, PK, Auto-Increment)
* `name` (VARCHAR, Unique)

---

### Employees Table
* `id` (INTEGER, PK, Auto-Increment)
* `employeeCode` (VARCHAR, Unique) - e.g. `EMP00001`
* `firstName` (VARCHAR)
* `lastName` (VARCHAR)
* `email` (VARCHAR, Unique)
* `gender` (VARCHAR) - `MALE`, `FEMALE`, `OTHER`
* `departmentId` (INTEGER, FK -> Departments.id)
* `designationId` (INTEGER, FK -> Designations.id)
* `employmentTypeId` (INTEGER, FK -> EmploymentTypes.id)
* `employmentStatus` (VARCHAR) - `ACTIVE`, `INACTIVE`
* `joiningDate` (DATE)
* `countryId` (INTEGER, FK -> Countries.id)
* `workLocation` (VARCHAR)
* `managerId` (INTEGER, Nullable, FK -> Employees.id)
* `createdAt` (DATETIME)
* `updatedAt` (DATETIME)
* `deletedAt` (DATETIME, Nullable)

---

### SalaryHistories Table
* `id` (INTEGER, PK, Auto-Increment)
* `employeeId` (INTEGER, FK -> Employees.id)
* `salary` (DECIMAL)
* `currency` (VARCHAR)
* `effectiveDate` (DATE)
* `revisionReason` (VARCHAR) - `JOINING`, `ANNUAL_REVIEW`, `PROMOTION`, `MARKET_ADJUSTMENT`, `OTHER`
* `createdAt` (DATETIME)
* `updatedAt` (DATETIME)

---

## 4. Key Relationships

1. **Manager Hierarchy**: Self-referencing relationship where `managerId` references another `Employee.id`. An employee can have many `subordinates` reporting to them.
2. **Salary History**: One employee can have many immutable salary history records, sorted chronologically by `effectiveDate`.

---

## 5. Indexing Strategy

To maintain high query responsiveness across 10,000+ employee records:
* **Employees**:
  * Index on `employeeCode` (Unique)
  * Index on `email` (Unique)
  * Index on `departmentId`, `countryId`, `designationId`, and `employmentTypeId` (Foreign keys)
  * Index on `managerId` (Self-referencing lookup)
* **SalaryHistories**:
  * Index on `employeeId` (Foreign key lookup)
  * Index on `effectiveDate` (Timeline ordering)
