module.exports = (router, container) => {
    const { analyticsController } = container;

    router.get(
        "/analytics",
        analyticsController.getDashboardStats.bind(analyticsController)
    );
};
