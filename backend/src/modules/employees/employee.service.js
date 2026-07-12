const { ApiError } = require("../../utils");
const { HTTP_STATUS, SalaryRevisionReason } = require("../../utils/constants");
const EmployeeMessages = require("./employee.message");
const EmployeeRepository = require("./employee.repository");

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
            const employee = await this.employeeRepository.create(
                {
                    employeeCode: payload.employeeCode,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    gender: payload.gender,
                    department: payload.department,
                    designation: payload.designation,
                    employmentType: payload.employmentType,
                    joiningDate: payload.joiningDate,
                    country: payload.country,
                    workLocation: payload.workLocation,
                    managerId: payload.managerId
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
                        {
                            association: "salaryHistory"
                        }
                    ],
                    transaction
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
}

module.exports = EmployeeService;