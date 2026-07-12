const BaseController = require("../base.controller");
const { HTTP_STATUS } = require("../../utils/constants");

class AnalyticsController extends BaseController {
    constructor(analyticsService) {
        super();
        this.analyticsService = analyticsService;
    }

    async getDashboardStats(req, res, next) {
        try {
            const stats = await this.analyticsService.getDashboardStats(req.query);
            return this.successResponseData(
                res,
                stats,
                1,
                "Analytics stats fetched successfully."
            );
        } catch (error) {
            return this.errorResponseWithoutData(
                res,
                error.statusCode || HTTP_STATUS.BAD_REQUEST,
                error.message
            );
        }
    }
}

module.exports = AnalyticsController;
