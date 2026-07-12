process.env.NODE_ENV = "test";
const { sequelize, models } = require("../src/models");

const initTestDb = async () => {
    await sequelize.sync({ force: true });
    
    const countryIn = await models.Country.create({
        name: "India",
        currency: "INR",
        exchangeRate: 1.0
    });
    
    const countryUs = await models.Country.create({
        name: "USA",
        currency: "USD",
        exchangeRate: 83.0
    });
    
    const dept = await models.Department.create({
        name: "Engineering"
    });
    
    const desg = await models.Designation.create({
        title: "Software Engineer",
        minSalary: 10000.0,
        maxSalary: 500000.0
    });
    
    const empType = await models.EmploymentType.create({
        name: "FULL_TIME"
    });
    
    return {
        countryInId: countryIn.id,
        countryUsId: countryUs.id,
        departmentId: dept.id,
        designationId: desg.id,
        employmentTypeId: empType.id
    };
};

module.exports = {
    initTestDb,
    sequelize,
    models
};
