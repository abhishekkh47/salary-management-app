# Database Design

## 1. Overview

The Employee Salary Management System uses a relational database (SQLite) to store employee information and salary history. The schema is normalized to separate employee details from salary records, ensuring historical salary data is preserved while keeping employee information concise.

The design prioritizes:

- Data integrity
- Historical traceability
- Scalability
- Efficient querying
- Simplicity for the MVP

---

## 2. Design Principles

The database schema follows these principles:

- Normalize salary history from employee records.
- Preserve historical salary changes through immutable salary records.
- Use soft deletion for employees to avoid losing historical data.
- Use foreign keys to maintain referential integrity.
- Index commonly queried fields for fast search and analytics.

---

## 3. Entity Relationship Diagram

```text
                Employee
          ---------------------
                id
                 │
        managerId│
                 ▼
             Employee

Employee (1)
     │
     │
     ▼
SalaryHistory (Many)
```

---

## 4. Employee


| Column           | Type     | Description                             |
| ---------------- | -------- | --------------------------------------- |
| id               | UUID     | Primary Key                             |
| employeeCode     | String   | Unique employee identifier              |
| firstName        | String   | Employee first name                     |
| lastName         | String   | Employee last name                      |
| email            | String   | Unique email address                    |
| gender           | Enum     | Male, Female, Other                     |
| department       | String   | Department name                         |
| designation      | String   | Job title                               |
| employmentType   | Enum     | Full-Time, Contractor, Intern           |
| employmentStatus | Enum     | Active, Inactive                        |
| joiningDate      | Date     | Employee joining date                   |
| country          | String   | Country of employment                   |
| workLocation     | String   | Office location                         |
| managerId        | UUID     | Self-referencing foreign key (nullable) |
| createdAt        | DateTime | Record creation timestamp               |
| updatedAt        | DateTime | Last modification timestamp             |
| deletedAt        | DateTime | Soft delete timestamp                   |


---

## 5. Salary History


| Column         | Type     | Description                                                 |
| -------------- | -------- | ----------------------------------------------------------- |
| id             | UUID     | Primary Key                                                 |
| employeeId     | UUID     | Foreign key to Employee                                     |
| salary         | Decimal  | Base salary amount                                          |
| currency       | String   | Salary currency                                             |
| effectiveDate  | Date     | Date from which the salary is effective                     |
| revisionReason | Enum     | Joining, Annual Review, Promotion, Market Adjustment, Other |
| createdAt      | DateTime | Record creation timestamp                                   |


Salary history records are immutable. Any salary change creates a new record instead of updating an existing one.

---

## 6. Relationships

- One Employee can have many Salary History records.
- One Employee may report to another Employee through `managerId`.

---

## 7. Indexing Strategy

### Employee

- employeeCode (Unique)
- email (Unique)
- department
- country
- employmentStatus
- employmentType
- managerId

### SalaryHistory

- employeeId
- effectiveDate
- currency

---

## 8. Seed Strategy

The database will be seeded with:

- 10,000 employees
- Approximately 35,000 salary history records
- 15 departments
- 20 countries
- 40 work locations
- Random manager hierarchy
- Realistic salary progression (2–5 revisions per employee)

---

## 9. Future Enhancements

The schema can be extended to support:

- Payroll processing
- Bonus and allowance management
- Multi-currency reporting
- Audit logs
- Approval workflows
- Authentication & RBAC
- AI-powered salary insights

