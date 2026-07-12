const SalaryHistoryValidator = require("./salary-history.validator");

module.exports = (router, container) => {
    const { salaryHistoryController } = container;

    router.get(
        "/employees/:id/salary-history",
        salaryHistoryController.getHistory.bind(salaryHistoryController)
    );

    router.post(
        "/employees/:id/salary-history",
        (req, res, next) => {
            SalaryHistoryValidator.addSalaryValidation(req, res, (isValid) => {
                if (isValid === true) {
                    next();
                }
            });
        },
        salaryHistoryController.addRecord.bind(salaryHistoryController)
    );
};
