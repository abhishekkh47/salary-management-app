const BaseController = require("../base.controller");
const { HTTP_STATUS } = require("../../utils/constants");
const EmployeeMessages = require("./employee.message");

class EmployeeController extends BaseController {
    constructor(employeeService) {
        super();
        this.employeeService = employeeService;
    }

    async create(req, res, next) {
        try {
            const employee = await this.employeeService.create(req.body);

            return this.successResponseData(
                res,
                employee,
                1,
                EmployeeMessages.CREATED
            );
        } catch (error) {
            return this.errorResponseWithoutData(
                res,
                HTTP_STATUS.BAD_REQUEST,
                error.message
            );
        }
    }

    async list(req, res, next) {
        try {
            const result = await this.employeeService.list(req.query);
            return this.successResponseData(
                res,
                result.employees,
                1,
                EmployeeMessages.LIST_FETCHED,
                {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages
                }
            );
        } catch (error) {
            return this.errorResponseWithoutData(
                res,
                error.statusCode || HTTP_STATUS.BAD_REQUEST,
                error.message
            );
        }
    }

    async getById(req, res, next) {
        try {
            const employee = await this.employeeService.getById(req.params.id);
            return this.successResponseData(
                res,
                employee,
                1,
                EmployeeMessages.FETCHED
            );
        } catch (error) {
            return this.errorResponseWithoutData(
                res,
                error.statusCode || HTTP_STATUS.BAD_REQUEST,
                error.message
            );
        }
    }

    async update(req, res, next) {
        try {
            const employee = await this.employeeService.update(req.params.id, req.body);
            return this.successResponseData(
                res,
                employee,
                1,
                EmployeeMessages.UPDATED
            );
        } catch (error) {
            return this.errorResponseWithoutData(
                res,
                error.statusCode || HTTP_STATUS.BAD_REQUEST,
                error.message
            );
        }
    }

    async delete(req, res, next) {
        try {
            await this.employeeService.delete(req.params.id);
            return this.successResponseWithoutData(
                res,
                1,
                EmployeeMessages.DEACTIVATED
            );
        } catch (error) {
            return this.errorResponseWithoutData(
                res,
                error.statusCode || HTTP_STATUS.BAD_REQUEST,
                error.message
            );
        }
    }
}

module.exports = EmployeeController;