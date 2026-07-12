const { Op } = require("sequelize");
const { ApiError } = require("../../utils");
const { HTTP_STATUS, SalaryRevisionReason } = require("../../utils/constants");
const EmployeeMessages = require("./employee.message");

class EmployeeService {
    constructor(
        employeeRepository,
        salaryHistoryRepository,
        sequelize
    ) {
        this.employeeRepository = employeeRepository;
        this.salaryHistoryRepository = salaryHistoryRepository;
        this.sequelize = sequelize;
    }

    async create(payload) {
        const transaction =
            await this.sequelize.transaction();
        try {
            const duplicate =
                await this.employeeRepository.findDuplicate(
                    payload.email,
                    payload.employeeCode
                );
            if (duplicate) {
                if (duplicate.email === payload.email) {
                    throw new ApiError(
                        HTTP_STATUS.CONFLICT,
                        EmployeeMessages.EMAIL_EXISTS
                    );
                }
                throw new ApiError(
                    HTTP_STATUS.CONFLICT,
                    EmployeeMessages.EMPLOYEE_CODE_EXISTS
                );
            }
            let resolvedManagerId = null;
            if (payload.managerId) {
                let manager;
                if (typeof payload.managerId === "string" && payload.managerId.startsWith("EMP")) {
                    manager = await this.employeeRepository.findOne({ employeeCode: payload.managerId }, { transaction });
                } else {
                    manager = await this.employeeRepository.findById(payload.managerId, { transaction });
                }
                if (!manager) {
                    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Manager not found");
                }
                resolvedManagerId = manager.id;
            }

            const employee = await this.employeeRepository.create(
                {
                    employeeCode: payload.employeeCode,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    gender: payload.gender,
                    departmentId: payload.departmentId,
                    designationId: payload.designationId,
                    employmentTypeId: payload.employmentTypeId,
                    joiningDate: payload.joiningDate,
                    countryId: payload.countryId,
                    workLocation: payload.workLocation,
                    managerId: resolvedManagerId
                },
                { transaction }
            );

            await this.salaryHistoryRepository.create(
                {
                    employeeId: employee.id,
                    salary: payload.salary,
                    currency: payload.currency,
                    effectiveDate: payload.effectiveDate,
                    revisionReason: SalaryRevisionReason.JOINING
                },
                { transaction }
            );
            await transaction.commit();
            const emp_details = await this.employeeRepository.findById(
                employee.id,
                {
                    include: [
                        { association: "salaryHistory" },
                        { association: "department" },
                        { association: "designation" },
                        { association: "employmentType" },
                        { association: "country" }
                    ]
                }
            );
            return emp_details;
        } catch (error) {
            await transaction.rollback();
            throw new ApiError(
                error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error.message || "Internal Server Error"
            );
        }
    }

    async list(query = {}) {
        const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
        const page = Math.max(parseInt(query.page, 10) || 1, 1);
        const offset = (page - 1) * limit;

        const where = {};
        if (query.search) {
            const searchVal = `%${query.search}%`;
            where[Op.or] = [
                { employeeCode: { [Op.like]: searchVal } },
                { firstName: { [Op.like]: searchVal } },
                { lastName: { [Op.like]: searchVal } },
                { email: { [Op.like]: searchVal } }
            ];
        }

        const filters = ["departmentId", "employmentTypeId", "gender", "countryId", "employmentStatus", "designationId"];
        filters.forEach(filter => {
            if (query[filter]) {
                where[filter] = query[filter];
            }
        });

        const { rows, count } = await this.employeeRepository.findAndCountAll({
            where,
            limit,
            offset,
            include: [
                { association: "salaryHistory" },
                { association: "department" },
                { association: "designation" },
                { association: "employmentType" },
                { association: "country" }
            ],
            distinct: true
        });

        return {
            employees: rows,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        };
    }

    async getById(id) {
        const employee = await this.employeeRepository.findById(id, {
            include: [
                { association: "salaryHistory" },
                { association: "department" },
                { association: "designation" },
                { association: "employmentType" },
                { association: "country" }
            ]
        });
        if (!employee) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, EmployeeMessages.NOT_FOUND);
        }
        return employee;
    }

    async update(id, payload) {
        const transaction = await this.sequelize.transaction();
        try {
            const employee = await this.employeeRepository.findById(id, {
                include: [{ association: "salaryHistory" }],
                transaction
            });
            if (!employee) {
                throw new ApiError(HTTP_STATUS.NOT_FOUND, EmployeeMessages.NOT_FOUND);
            }

            let resolvedManagerId = null;
            if (payload.managerId) {
                let manager;
                if (typeof payload.managerId === "string" && payload.managerId.startsWith("EMP")) {
                    manager = await this.employeeRepository.findOne({ employeeCode: payload.managerId }, { transaction });
                } else {
                    manager = await this.employeeRepository.findById(payload.managerId, { transaction });
                }
                if (!manager) {
                    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Manager not found");
                }
                if (parseInt(id, 10) === manager.id) {
                    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "An employee cannot be their own manager");
                }
                resolvedManagerId = manager.id;
            }

            if (payload.email || payload.employeeCode) {
                const checkEmail = payload.email || employee.email;
                const checkCode = payload.employeeCode || employee.employeeCode;
                const duplicate = await this.employeeRepository.findDuplicate(checkEmail, checkCode);
                if (duplicate && duplicate.id !== employee.id) {
                    if (duplicate.email === payload.email) {
                        throw new ApiError(HTTP_STATUS.CONFLICT, EmployeeMessages.EMAIL_EXISTS);
                    }
                    throw new ApiError(HTTP_STATUS.CONFLICT, EmployeeMessages.EMPLOYEE_CODE_EXISTS);
                }
            }

            await this.employeeRepository.update(id, {
                employeeCode: payload.employeeCode,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                gender: payload.gender,
                departmentId: payload.departmentId,
                designationId: payload.designationId,
                employmentTypeId: payload.employmentTypeId,
                employmentStatus: payload.employmentStatus,
                joiningDate: payload.joiningDate,
                countryId: payload.countryId,
                workLocation: payload.workLocation,
                managerId: resolvedManagerId
            }, { transaction });

            if (payload.salary !== undefined || payload.currency !== undefined || payload.effectiveDate !== undefined) {
                const currentSalary = employee.salaryHistory && employee.salaryHistory.length > 0
                    ? employee.salaryHistory.sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate))[0]
                    : null;

                const newSalary = payload.salary !== undefined ? payload.salary : (currentSalary ? currentSalary.salary : 0);
                const newCurrency = payload.currency !== undefined ? payload.currency : (currentSalary ? currentSalary.currency : "");
                const newEffectiveDate = payload.effectiveDate !== undefined ? payload.effectiveDate : new Date();

                await this.salaryHistoryRepository.create({
                    employeeId: employee.id,
                    salary: newSalary,
                    currency: newCurrency,
                    effectiveDate: newEffectiveDate,
                    revisionReason: payload.revisionReason || SalaryRevisionReason.ANNUAL_REVIEW
                }, { transaction });
            }

            await transaction.commit();

            return await this.employeeRepository.findById(id, {
                include: [
                    { association: "salaryHistory" },
                    { association: "department" },
                    { association: "designation" },
                    { association: "employmentType" },
                    { association: "country" }
                ]
            });
        } catch (error) {
            await transaction.rollback();
            throw new ApiError(
                error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error.message || "Internal Server Error"
            );
        }
    }

    async delete(id) {
        const transaction = await this.sequelize.transaction();
        try {
            const employee = await this.employeeRepository.findById(id, { transaction });
            if (!employee) {
                throw new ApiError(HTTP_STATUS.NOT_FOUND, EmployeeMessages.NOT_FOUND);
            }

            await employee.destroy({ transaction });

            const { models } = require("../../models");
            await models.SalaryHistory.destroy({
                where: { employeeId: id },
                transaction
            });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw new ApiError(
                error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error.message || "Internal Server Error"
            );
        }
    }
}

module.exports = EmployeeService;