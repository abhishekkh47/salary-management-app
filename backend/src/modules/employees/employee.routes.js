const EmployeeValidator = require("./employee.validator");

module.exports = (router, container) => {
    const { employeeController } = container;

    router.post(
        "/employees",
        (req, res, next) => {
            EmployeeValidator.createEmployeeValidation(req, res, (isValid) => {
                if (isValid === true) {
                    next();
                }
            });
        },
        employeeController.create.bind(employeeController)
    );
};