const Joi = require("joi");
const {
    Gender,
    EmploymentType
} = require("../../utils/constants");
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
            department: Joi.string().required(),
            designation: Joi.string().required(),
            employmentType: Joi.string().valid(...Object.values(EmploymentType)).required(),
            joiningDate: Joi.date().required(),
            country: Joi.string().required(),
            workLocation: Joi.string().required(),
            managerId: Joi.number().allow(null),
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
    }
};