const { models } = require("../../models");

class SalaryHistoryRepository {
    constructor() {
        this.salaryHistoryModel = models.SalaryHistory;
    }

    async create(payload, options = {}) {
        return this.salaryHistoryModel.create(payload, options);
    }

    async findByEmployeeId(employeeId) {
        return this.salaryHistoryModel.findAll({
            where: { employeeId },
            order: [["effectiveDate", "DESC"], ["createdAt", "DESC"]]
        });
    }
}

module.exports = SalaryHistoryRepository;