const EmployeeRepository = require("../modules/employees/employee.repository");
const EmployeeService = require("../modules/employees/employee.service");
const EmployeeController = require("../modules/employees/employee.controller");
const SalaryHistoryRepository = require("../modules/salaries/salary-history.repository");
const SalaryHistoryService = require("../modules/salaries/salary-history.service");
const SalaryHistoryController = require("../modules/salaries/salary-history.controller");
const AnalyticsRepository = require("../modules/analytics/analytics.repository");
const AnalyticsService = require("../modules/analytics/analytics.service");
const AnalyticsController = require("../modules/analytics/analytics.controller");
const { sequelize } = require("../models");

const employeeRepository = new EmployeeRepository();
const salaryHistoryRepository = new SalaryHistoryRepository();
const analyticsRepository = new AnalyticsRepository(sequelize);

const employeeService =
    new EmployeeService(employeeRepository, salaryHistoryRepository, sequelize);

const salaryHistoryService =
    new SalaryHistoryService(salaryHistoryRepository, employeeRepository, sequelize);

const analyticsService =
    new AnalyticsService(analyticsRepository);

const employeeController =
    new EmployeeController(employeeService);

const salaryHistoryController =
    new SalaryHistoryController(salaryHistoryService);

const analyticsController =
    new AnalyticsController(analyticsService);

module.exports = {
    employeeController,
    salaryHistoryController,
    analyticsController
};