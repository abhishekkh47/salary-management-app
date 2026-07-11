const { Sequelize } = require("sequelize");
const dbConfig = require("./dbConfig");
const env = require("./env");

class Database {
    constructor() {
        this.sequelize = new Sequelize(dbConfig[env.NODE_ENV]);
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            console.log("Database connected successfully.");
        } catch (error) {
            console.error("Database connection failed.");
            throw error;
        }
    }

    getInstance() {
        return this.sequelize;
    }
}

module.exports = new Database();