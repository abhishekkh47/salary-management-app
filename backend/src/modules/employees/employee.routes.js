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

    router.get(
        "/employees",
        employeeController.list.bind(employeeController)
    );

    router.get(
        "/employees/:id",
        employeeController.getById.bind(employeeController)
    );

    router.patch(
        "/employees/:id",
        (req, res, next) => {
            EmployeeValidator.updateEmployeeValidation(req, res, (isValid) => {
                if (isValid === true) {
                    next();
                }
            });
        },
        employeeController.update.bind(employeeController)
    );

    router.delete(
        "/employees/:id",
        employeeController.delete.bind(employeeController)
    );
};