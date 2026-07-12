const { models } = require("../../models");

class AnalyticsRepository {
    constructor(sequelize) {
        this.sequelize = sequelize;
    }

    async getEmployeesWithLatestSalary(where = {}) {
        return models.Employee.findAll({
            attributes: [
                "id",
                "firstName",
                "lastName",
                "workLocation",
                "employmentStatus"
            ],
            where,
            include: [
                { association: "department" },
                { association: "designation" },
                { association: "employmentType" },
                { association: "country" },
                {
                    model: models.SalaryHistory,
                    as: "salaryHistory",
                    attributes: ["salary", "currency"],
                    required: true,
                    where: this.sequelize.literal(`
                        "salaryHistory"."id" = (
                            SELECT id 
                            FROM salary_histories 
                            WHERE employeeId = "Employee"."id" 
                              AND deletedAt IS NULL 
                            ORDER BY effectiveDate DESC, createdAt DESC 
                            LIMIT 1
                        )
                    `)
                }
            ]
        });
    }
}

module.exports = AnalyticsRepository;
