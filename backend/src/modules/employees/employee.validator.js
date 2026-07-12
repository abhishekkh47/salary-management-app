const Joi = require("joi");
const { Gender } = require("../../utils/constants");
const {
    validationMessageKey,
    validationErrorResponseData
} = require("../../utils/helper");

module.exports = {
    createEmployeeValidation: (req, res, callback) => {
        const schema = Joi.object({
            employeeCode: Joi.string().trim().required(),
            firstName: Joi.string().trim().required(),
            lastName: Joi.string().trim().required(),
            email: Joi.string().email().required(),
            gender: Joi.string().valid(...Object.values(Gender)).required(),
            departmentId: Joi.number().integer().positive().required(),
            designationId: Joi.number().integer().positive().required(),
            employmentTypeId: Joi.number().integer().positive().required(),
            joiningDate: Joi.date().required(),
            countryId: Joi.number().integer().positive().required(),
            workLocation: Joi.string().required(),
            managerId: Joi.number().integer().positive().allow(null),
            salary: Joi.number().positive().required(),
            currency: Joi.string().required(),
            effectiveDate: Joi.date().required()
        });

        const { error } = schema.validate(req.body);
        if (error) {
            const key = validationMessageKey("createEmployee", error);
            const message = typeof res.__ === "function" ? res.__(key) : error.details[0].message;
            return validationErrorResponseData(res, message);
        }
        return callback(true);
    },

    updateEmployeeValidation: (req, res, callback) => {
        const schema = Joi.object({
            employeeCode: Joi.string().trim().optional(),
            firstName: Joi.string().trim().optional(),
            lastName: Joi.string().trim().optional(),
            email: Joi.string().email().optional(),
            gender: Joi.string().valid(...Object.values(Gender)).optional(),
            departmentId: Joi.number().integer().positive().optional(),
            designationId: Joi.number().integer().positive().optional(),
            employmentTypeId: Joi.number().integer().positive().optional(),
            employmentStatus: Joi.string().optional(),
            joiningDate: Joi.date().optional(),
            countryId: Joi.number().integer().positive().optional(),
            workLocation: Joi.string().optional(),
            managerId: Joi.number().integer().positive().allow(null).optional(),
            salary: Joi.number().positive().optional(),
            currency: Joi.string().optional(),
            effectiveDate: Joi.date().optional(),
            revisionReason: Joi.string().optional()
        });

        const { error } = schema.validate(req.body);
        if (error) {
            const key = validationMessageKey("updateEmployee", error);
            const message = typeof res.__ === "function" ? res.__(key) : error.details[0].message;
            return validationErrorResponseData(res, message);
        }
        return callback(true);
    }
};