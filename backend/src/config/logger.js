const { createLogger, format, transports } = require("winston");

class Logger {
    constructor() {
        this.logger = createLogger({
            level: "info",
            format: format.combine(
                format.timestamp(),
                format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
                })
            ),
            transports: [
                new transports.Console()
            ]
        });
    }

    info(message) {
        this.logger.info(message);
    }

    warn(message) {
        this.logger.warn(message);
    }

    error(message) {
        this.logger.error(message);
    }

    debug(message) {
        this.logger.debug(message);
    }
}

module.exports = new Logger();