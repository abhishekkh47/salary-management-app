const express = require("express");

const registerEmployeeRoutes = require("../modules/employees/employee.routes");
const container = require("../container");

const router = express.Router();

registerEmployeeRoutes(router, container);

module.exports = router;