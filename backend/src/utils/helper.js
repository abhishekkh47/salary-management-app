const {
    HTTP_STATUS,
} = require("./constants");

module.exports = {
    /**
     * @description This function use for create validation unique key
     * @param apiTag
     * @param error
     * @returns {*}
     */
    validationMessageKey(apiTag, error) {
        let key = module.exports.toUpperCase(error.details[0].context.key);
        let type = error.details[0].type.split(".");
        type = module.exports.toUpperCase(type[1]);
        key = apiTag + key + type;
        return key;
    },

    /**
     * @description This function use for format string to uppercase
     * @param str
     * @returns {string}
     */
    toUpperCase(str) {
        if (str.length > 0) {
            const newStr = str
                .toLowerCase()
                .replace(/_([a-z])/, (m) => m.toUpperCase())
                .replace(/_/, "");
            return str.charAt(0).toUpperCase() + newStr.slice(1);
        }
        return "";
    },

    /**
     * @description This function use for format validation error response of rest api
     * @param res
     * @param message
     * @param code
     * @returns {{response: {code: *, message: *}}}
     */
    validationErrorResponseData(res, message, code = HTTP_STATUS.BAD_REQUEST) {
        const response = {
            code,
            message,
        };
        return res.status(code).send(response);
    },
}