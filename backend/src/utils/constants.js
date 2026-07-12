"use strict";
module.exports = {
    EmploymentStatus: {
        ACTIVE: 'ACTIVE',
        INACTIVE: "INACTIVE"
    },
    EmploymentType: {
        FULL_TIME: "FULL_TIME",
        CONTRACTOR: "CONTRACTOR",
        INTERN: "INTERN",
    },
    Gender: {
        MALE: "MALE",
        FEMALE: "FEMALE",
        OTHER: "OTHER",
    },
    SalaryRevisionReason: {
        JOINING: "JOINING",
        ANNUAL_REVIEW: "ANNUAL_REVIEW",
        PROMOTION: "PROMOTION",
        MARKET_ADJUSTMENT: "MARKET_ADJUSTMENT",
        OTHER: "OTHER",
    },
    HTTP_STATUS: {
        SUCCESS: 200,
        CREATED: 201,
        NO_CONTENT: 204,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        CONFLICT: 409,
        UNPROCESSABLE_ENTITY: 422,
        INTERNAL_SERVER_ERROR: 500,
        SERVICE_UNAVAILABLE: 503,
    },
}
