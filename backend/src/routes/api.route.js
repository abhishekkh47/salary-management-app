const express = require("express");

const registerEmployeeRoutes = require("../modules/employees/employee.routes");
const registerSalaryHistoryRoutes = require("../modules/salaries/salary-history.routes");
const registerAnalyticsRoutes = require("../modules/analytics/analytics.routes");
const registerLookupRoutes = require("../modules/lookups/lookup.routes");
const container = require("../container");

const router = express.Router();

registerEmployeeRoutes(router, container);
registerSalaryHistoryRoutes(router, container);
registerAnalyticsRoutes(router, container);
registerLookupRoutes(router);

module.exports = router;