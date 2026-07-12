const { Op } = require("sequelize");
const { models } = require("../../models");

class EmployeeRepository {
    constructor() {
        this.employeeModel = models.Employee;
    }

    async create(payload, options = {}) {
        return this.employeeModel.create(payload, options);
    }

    async findById(id, options = {}) {
        return this.employeeModel.findByPk(id, options);
    }

    async findOne(where, options = {}) {
        return this.employeeModel.findOne({
            where,
            ...options,
        });
    }

    async update(id, payload, options = {}) {
        return this.employeeModel.update(payload, {
            where: { id },
            ...options,
        });
    }

    async findAndCountAll(options = {}) {
        return this.employeeModel.findAndCountAll(options);
    }

    async findDuplicate(email, employeeCode) {
        return this.employeeModel.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { employeeCode }
                ]
            }
        });
    }
}

module.exports = EmployeeRepository;