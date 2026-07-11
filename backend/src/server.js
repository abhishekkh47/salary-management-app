const app = require("./app");
const env = require("./config/env");
const logger = require("./config/logger");
const database = require("./config/database")
require("./models");

server = async () => {
    try {
        await database.connect();

        app.listen(env.PORT, () => {
            logger.info(`Server started on port ${env.PORT}`);
        });
    } catch (error) {
        logger.error(error.message);
        process.exit(1);
    }
};

server()
