const { ApiError } = require("../utils");
const { HTTP_STATUS } = require("../utils/constants");

class ValidationMiddleware {
    static validate(schema) {
        return async (req, res, next) => {
            try {
                await schema.validateAsync(req.body, {
                    abortEarly: false
                });

                next();
            } catch (error) {
                return next(
                    new ApiError(
                        HTTP_STATUS.BAD_REQUEST,
                        error.details.map(d => d.message).join(", "),
                        []
                    )
                );
            }
        };
    }
}

module.exports = ValidationMiddleware;