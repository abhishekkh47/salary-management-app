const BaseController = require("../base.controller");
const { HTTP_STATUS } = require("../../utils/constants");

class SalaryHistoryController extends BaseController {
    constructor(salaryHistoryService) {
        super();
        this.salaryHistoryService = salaryHistoryService;
    }

    async getHistory(req, res, next) {
        try {
            const employeeId = parseInt(req.params.id, 10);
            const history = await this.salaryHistoryService.getHistory(employeeId);
            return this.successResponseData(res, history, 1, "Salary history fetched successfully");
        } catch (error) {
            return this.errorResponseWithoutData(
                res,
                error.statusCode || HTTP_STATUS.BAD_REQUEST,
                error.message
            );
        }
    }

    async addRecord(req, res, next) {
        try {
            const employeeId = parseInt(req.params.id, 10);
            const record = await this.salaryHistoryService.addRecord(employeeId, req.body);
            return this.successResponseData(res, record, 1, "Salary record added successfully");
        } catch (error) {
            return this.errorResponseWithoutData(
                res,
                error.statusCode || HTTP_STATUS.BAD_REQUEST,
                error.message
            );
        }
    }
}

module.exports = SalaryHistoryController;
