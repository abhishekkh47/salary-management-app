const { ApiError } = require("../../utils");
const { HTTP_STATUS } = require("../../utils/constants");

class SalaryHistoryService {
    constructor(salaryHistoryRepository, employeeRepository, sequelize) {
        this.salaryHistoryRepository = salaryHistoryRepository;
        this.employeeRepository = employeeRepository;
        this.sequelize = sequelize;
    }

    async getHistory(employeeId) {
        const employee = await this.employeeRepository.findById(employeeId);
        if (!employee) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found");
        }
        return this.salaryHistoryRepository.findByEmployeeId(employeeId);
    }

    async addRecord(employeeId, payload) {
        const employee = await this.employeeRepository.findById(employeeId);
        if (!employee) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found");
        }

        const record = await this.salaryHistoryRepository.create({
            employeeId,
            salary: parseFloat(payload.salary),
            currency: payload.currency,
            effectiveDate: payload.effectiveDate,
            revisionReason: payload.revisionReason
        });

        return record;
    }
}

module.exports = SalaryHistoryService;
