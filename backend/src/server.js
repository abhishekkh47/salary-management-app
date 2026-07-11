const app = require("./app");
const env = require("./config/env");
const logger = require("./config/logger");

app.listen(env.PORT, () => {
    logger.info(`Server started on port ${env.PORT}`);
});