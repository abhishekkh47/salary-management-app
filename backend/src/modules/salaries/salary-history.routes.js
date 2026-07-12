const SalaryHistoryController = require("./salary-history.controller");

module.exports = (router, container) => {
    const { salaryHistoryRepository, employeeRepository } = container;
    const controller = new SalaryHistoryController(salaryHistoryRepository, employeeRepository);

    router.get(
        "/employees/:id/salary-history",
        controller.getHistory.bind(controller)
    );

    router.post(
        "/employees/:id/salary-history",
        controller.addRecord.bind(controller)
    );
};
