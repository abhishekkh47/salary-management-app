"use strict";

class ApiError extends Error {
  /**
   * Create API Error
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array} errors - Array of validation errors
   * @param {boolean} isOperational - Whether the error is operational
   */
  constructor(statusCode, message, errors = [], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }

  // Static helper for i18n-translated messages
  static t(__i, statusCode, key, errors = [], isOperational = true) {
    return new ApiError(statusCode, __i(key), errors, isOperational);
  }
}

module.exports = { ApiError };
