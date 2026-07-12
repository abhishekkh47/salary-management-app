const EmployeeRepository = require("../modules/employees/employee.repository");
const EmployeeService = require("../modules/employees/employee.service");
const EmployeeController = require("../modules/employees/employee.controller");
const SalaryHistoryRepository = require("../modules/salaries/salary-history.repository");
const AnalyticsRepository = require("../modules/analytics/analytics.repository");
const AnalyticsService = require("../modules/analytics/analytics.service");
const { sequelize } = require("../models");

const employeeRepository = new EmployeeRepository();
const salaryHistoryRepository = new SalaryHistoryRepository();
const analyticsRepository = new AnalyticsRepository(sequelize);

const employeeService =
    new EmployeeService(employeeRepository, salaryHistoryRepository, sequelize);

const employeeController =
    new EmployeeController(employeeService);

const analyticsService =
    new AnalyticsService(analyticsRepository);

module.exports = {
    employeeController,
    analyticsService,
    employeeRepository,
    salaryHistoryRepository
};