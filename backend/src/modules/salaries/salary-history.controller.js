const BaseController = require("../base.controller");
const { HTTP_STATUS } = require("../../utils/constants");

class SalaryHistoryController extends BaseController {
    constructor(salaryHistoryRepository, employeeRepository) {
        super();
        this.salaryHistoryRepository = salaryHistoryRepository;
        this.employeeRepository = employeeRepository;
    }

    async getHistory(req, res, next) {
        try {
            const employeeId = parseInt(req.params.id, 10);
            const employee = await this.employeeRepository.findById(employeeId);
            if (!employee) {
                return this.errorResponseWithoutData(res, HTTP_STATUS.NOT_FOUND, "Employee not found");
            }

            const history = await this.salaryHistoryRepository.findByEmployeeId(employeeId);
            return this.successResponseData(res, history, 1, "Salary history fetched successfully");
        } catch (error) {
            return this.internalServerErrorResponse(res);
        }
    }

    async addRecord(req, res, next) {
        try {
            const employeeId = parseInt(req.params.id, 10);
            const employee = await this.employeeRepository.findById(employeeId);
            if (!employee) {
                return this.errorResponseWithoutData(res, HTTP_STATUS.NOT_FOUND, "Employee not found");
            }

            const payload = {
                employeeId,
                salary: parseFloat(req.body.salary),
                currency: req.body.currency,
                effectiveDate: req.body.effectiveDate,
                revisionReason: req.body.revisionReason
            };

            const record = await this.salaryHistoryRepository.create(payload);
            return this.successResponseData(res, record, 1, "Salary record added successfully");
        } catch (error) {
            return this.errorResponseWithoutData(res, HTTP_STATUS.BAD_REQUEST, error.message);
        }
    }
}

module.exports = SalaryHistoryController;
