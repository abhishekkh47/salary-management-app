const {
    SALARY_REVISION_REASON
} = require("./constants");

function generateSalaryHistory(employee) {

    return {
        employeeId: employee.id,
        salary: employee.salary,
        currency: employee.currency,
        effectiveDate: employee.joiningDate,
        revisionReason: SALARY_REVISION_REASON,
        createdAt: new Date(),
        updatedAt: new Date()
    };
}

module.exports = generateSalaryHistory;