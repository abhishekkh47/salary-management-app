const { ApiError } = require("../../utils");
const { HTTP_STATUS } = require("../../utils/constants");
const { models } = require("../../models");

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
        const employee = await this.employeeRepository.findById(employeeId, {
            include: ["country"]
        });
        if (!employee) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Employee not found");
        }

        if (employee.country && payload.currency !== employee.country.currency) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                `Currency must match country currency: ${employee.country.currency}`
            );
        }

        // Dynamically validate that the currency exists in our countries table
        const country = await models.Country.findOne({ where: { currency: payload.currency } });
        if (!country) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Unsupported currency: ${payload.currency}`);
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
