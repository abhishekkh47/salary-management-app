"use strict";

const { HTTP_STATUS } = require("../utils/constants");

class BaseController {
  /**
   * @description This function use for format success response of rest api containing data
   * @param {import('express').Response} res
   * @param {*} data
   * @param {number} code
   * @param {string} message
   * @param {Record<string, *>} [extras]
   * @returns {*}
   */
  successResponseData(res, data, code = 1, message, extras) {
    const response = {
      data,
      meta: {
        code,
        message,
      },
    };
    if (extras) {
      Object.keys(extras).forEach((key) => {
        if ({}.hasOwnProperty.call(extras, key)) {
          response.meta[key] = extras[key];
        }
      });
    }
    return res.send(response);
  }

  /**
   * @description This function use for format success response of rest api witout data
   * @param {import('express').Response} res
   * @param {number} code
   * @param {string} message
   * @param {Record<string, *>} [extras]
   * @returns {*}
   */
  successResponseWithoutData(res, code = 1, message, extras) {
    const response = {
      data: null,
      meta: {
        code,
        message,
      },
    };
    if (extras) {
      Object.keys(extras).forEach((key) => {
        if ({}.hasOwnProperty.call(extras, key)) {
          response.meta[key] = extras[key];
        }
      });
    }
    return res.send(response);
  }

  /**
   * @description This function use for format error response of rest api
   * @param {import('express').Response} res
   * @param {number} code
   * @param {string} message
   * @returns {*}
   */
  errorResponseData(res, code = HTTP_STATUS.BAD_REQUEST, message) {
    const response = {
      code: 0,
      message,
    };
    return res.status(code).send(response);
  }

  /**
   * @description This function use for format error response of rest api witout data
   * @param {import('express').Response} res
   * @param {number} code
   * @param {string} message
   * @returns {*}
   */
  errorResponseWithoutData(res, code = HTTP_STATUS.BAD_REQUEST, message) {
    const response = {
      data: null,
      meta: {
        code: 0,
        message,
      },
    };
    if (code > HTTP_STATUS.SUCCESS) {
      return res.status(code).send(response);
    } else {
      return res.send(response);
    }
  }

  /**
   * @description This function use for format validation error response of rest api
   * @param {import('express').Response} res
   * @param {string} message
   * @param {number} code
   * @returns {*}
   */
  validationErrorResponseData(res, message, code = HTTP_STATUS.BAD_REQUEST) {
    const response = {
      code,
      message,
    };
    return res.status(code).send(response);
  }

  /**
   * @description This function use for server error response of rest api
   * @param res
   * @param message
   * @param code
   * @returns {{response: {code: *, message: *}}}
   */
  internalServerErrorResponse(res) {
    const response = {
      code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: typeof res.__ === "function" ? res.__("internalError") : "Internal Server Error",
    };

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send(response);
  }

  /**
   * @description This function use for format error response of rest api containing data
   * @param {import('express').Response} res
   * @param {*} data
   * @param {number} code
   * @param {string} message
   * @param {Record<string, *>} [extras]
   * @returns {*}
   */
  errorResponseWithData(res, data, code = 0, message, extras) {
    const response = {
      data,
      meta: {
        code,
        message,
      },
    };
    if (extras) {
      Object.keys(extras).forEach((key) => {
        if ({}.hasOwnProperty.call(extras, key)) {
          response.meta[key] = extras[key];
        }
      });
    }
    return res.status(HTTP_STATUS.SUCCESS).send(response);
  }
}

module.exports = BaseController;
