const EmployeeRepository = require("../modules/employees/employee.repository");
const EmployeeService = require("../modules/employees/employee.service");
const EmployeeController = require("../modules/employees/employee.controller");
const SalaryHistoryRepository = require("../modules/salaries/salary-history.repository");
const { sequelize } = require("../models");

const employeeRepository = new EmployeeRepository();
const salaryHistoryRepository = new SalaryHistoryRepository();

const employeeService =
    new EmployeeService(employeeRepository, salaryHistoryRepository, sequelize);

const employeeController =
    new EmployeeController(employeeService);

module.exports = {
    employeeController
};