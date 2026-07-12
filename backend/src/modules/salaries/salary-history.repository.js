const { models } = require("../../models");

class SalaryHistoryRepository {
    constructor() {
        this.salaryHistoryModel = models.SalaryHistory;
    }

    async create(payload, options = {}) {
        return this.salaryHistoryModel.create(payload, options);
    }
}

module.exports = SalaryHistoryRepository;