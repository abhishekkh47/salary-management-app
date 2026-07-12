const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const apiRoutes = require("./routes/api.route");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Application is running."
    });
});

app.use("/api/v1", apiRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        code: 0,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});

module.exports = app;