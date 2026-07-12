const AnalyticsController = require("./analytics.controller");

module.exports = (router, container) => {
    const { analyticsService } = container;
    const analyticsController = new AnalyticsController(analyticsService);

    router.get(
        "/analytics",
        analyticsController.getDashboardStats.bind(analyticsController)
    );
};
