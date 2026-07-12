const BaseController = require("../base.controller");
const { HTTP_STATUS } = require("../../utils/constants");
const EmployeeMessages = require("./employee.message");

class EmployeeController extends BaseController {
    constructor(employeeService) {
        super();
        this.employeeService = employeeService;
    }

    async create(req, res, next) {
        try {
            const employee = await this.employeeService.create(req.body);

            return this.successResponseData(
                res,
                employee,
                1,
                EmployeeMessages.CREATED
            );
        } catch (error) {
            return this.errorResponseWithoutData(
                res,
                HTTP_STATUS.BAD_REQUEST,
                error.message
            );
        }
    }
}

module.exports = EmployeeController;