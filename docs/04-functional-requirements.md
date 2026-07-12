# Functional Requirements

## 1. Overview

This document defines the functional behavior of the Employee Salary Management System (ESMS), describing the features available to the HR Manager, business rules, and form input behaviors.

---

## 2. Dashboard Tab

The dashboard is read-only and visualizes total organizational compensation metrics:
* **Metric Cards**:
  * Headcount counts (Total, Active, Inactive).
  * Financial metrics: Total Payroll and Average Salary (formatted dynamically into Lakhs `L` and Crores `Cr` for readability, resolving long numbers).
  * Salary boundaries (Highest, Lowest).
* **Analytics Charts**:
  * **Payroll by Department**: A bar chart displaying department payroll totals. Axis tick marks are formatted in Lakhs and Crores.
  * **Salary Distribution**: A pie chart showing employee counts grouped by salary brackets.
  * **Payroll by Country**: A bar chart summarizing total payroll converted to INR based on country exchange rates.

---

## 3. Employee Management Tab

### View and Search
* **Employee List**: Paginated table listing employee code, name, email, department, designation, and status.
* **Filters**: Quick-filter rows using dynamic dropdown values loaded from lookup tables (Country, Department, Designation, Status).
* **Search**: Instant text search by name, email, or employee code.

### Details Slide-out Drawer
Clicking on an employee opens a side-drawer displaying details grouped under three tabs:
1. **Overview**: Displays profile data (Email, Department, Designation, Country, Location, Joining Date, and Manager ID formatted as `EMPXXXXX`).
2. **Salary History**: Displays a timeline of base salary revisions and a **Revise** button.
3. **Direct Reports**: Lists all employees reporting to the selected individual. Clicking on a report dynamically loads their profile in the drawer.

---

## 4. Input Rules & Form Behaviors

### 1. Employee Code & Manager ID Input
* **Prefixed Fields**: Input fields for Employee Code (registration) and Manager ID (registration and edit modal) feature a visual, non-editable prefix box reading `EMP`.
* **Constraint**: Users enter only the last 5 numeric digits (e.g. `00142` or `142`). The input restricts entries to digits and a max length of 5.
* **Validation & Saving**:
  * On submit, the value is zero-padded to 5 digits and prefixed (e.g., `142` becomes `EMP00142`).
  * The backend resolves the manager code `EMP00142` into the database primary key `id` of that manager.

### 2. Currency Fields
* **Disabled Control**: Currency fields on both the "Register New Employee" tab and the "Salary Revision" modal are disabled (non-editable).
* **Behavior**:
  * Registration: The currency code automatically changes based on the selected country lookup.
  * Revision: The currency is locked to the employee's country currency.

### 3. Manager Integrity
* **Validations**:
  * An employee cannot be assigned as their own manager (self-reporting block).
  * Assigned managers must exist in the database (invalid ID checks).
