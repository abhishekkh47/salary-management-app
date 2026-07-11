const env = require("./env");

module.exports = {
    development: {
        dialect: env.DB_DIALECT,
        storage: env.DB_STORAGE,
        logging: false
    },

    test: {
        dialect: "sqlite",
        storage: ":memory:",
        logging: false
    },

    production: {
        dialect: env.DB_DIALECT,
        storage: env.DB_STORAGE,
        logging: false
    }
};