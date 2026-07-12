const Joi = require("joi");
const { SalaryRevisionReason } = require("../../utils/constants");
const {
    validationMessageKey,
    validationErrorResponseData
} = require("../../utils/helper");

module.exports = {
    addSalaryValidation: (req, res, callback) => {
        const schema = Joi.object({
            salary: Joi.number().positive().required(),
            currency: Joi.string().trim().required(),
            effectiveDate: Joi.date().required(),
            revisionReason: Joi.string().valid(...Object.values(SalaryRevisionReason)).required()
        });

        const { error } = schema.validate(req.body);
        if (error) {
            const key = validationMessageKey("addSalary", error);
            const message = typeof res.__ === "function" ? res.__(key) : error.details[0].message;
            return validationErrorResponseData(res, message);
        }
        return callback(true);
    }
};
