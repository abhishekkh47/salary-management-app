const BaseController = require("../base.controller");
const { models } = require("../../models");

class LookupController extends BaseController {
    async getAllLookups(req, res, next) {
        try {
            const [departments, designations, countries, employmentTypes] = await Promise.all([
                models.Department.findAll({ order: [["name", "ASC"]] }),
                models.Designation.findAll({ order: [["title", "ASC"]] }),
                models.Country.findAll({ order: [["name", "ASC"]] }),
                models.EmploymentType.findAll({ order: [["name", "ASC"]] })
            ]);

            return this.successResponseData(
                res,
                {
                    departments,
                    designations,
                    countries,
                    employmentTypes
                },
                1,
                "Lookups fetched successfully."
            );
        } catch (error) {
            return this.internalServerErrorResponse(res);
        }
    }
}

module.exports = LookupController;
