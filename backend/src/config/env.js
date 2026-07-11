require("dotenv").config();

class Env {
    get PORT() {
        return process.env.PORT || 3000;
    }
    get NODE_ENV() {
        return process.env.NODE_ENV;
    }
    get DB_STORAGE() {
        return process.env.DB_STORAGE;
    }
    get DB_DIALECT() {
        return process.env.DB_DIALECT;
    }
    get DB_LOGGING() {
        return process.env.DB_LOGGING;
    }
}

module.exports = new Env();