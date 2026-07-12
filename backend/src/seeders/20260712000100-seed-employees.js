"use strict";

const generateEmployee = require("./helpers/employee-generator");
const generateSalary = require("./helpers/salary-generator");
const { DEPARTMENTS, DESIGNATIONS, EMPLOYMENT_TYPES, COUNTRIES, CURRENCIES } = require("./helpers/constants");

const EXCHANGE_RATES = {
    India: 1.0,
    USA: 83.5,
    UK: 106.0,
    Germany: 90.7,
    Canada: 61.0,
    Australia: 55.4
};

module.exports = {

    async up(queryInterface) {

        const now = new Date();

        // 1. Seed lookup tables inside transaction
        await queryInterface.sequelize.transaction(async (transaction) => {
            // Seed departments
            const deptPayloads = DEPARTMENTS.map(d => ({
                name: d.name,
                createdAt: now,
                updatedAt: now
            }));
            await queryInterface.bulkInsert("departments", deptPayloads, { transaction });

            // Seed employment_types
            const empTypePayloads = EMPLOYMENT_TYPES.map(e => ({
                name: e.value,
                createdAt: now,
                updatedAt: now
            }));
            await queryInterface.bulkInsert("employment_types", empTypePayloads, { transaction });

            // Seed countries
            const countryPayloads = COUNTRIES.map(c => ({
                name: c,
                currency: CURRENCIES[c],
                exchangeRate: EXCHANGE_RATES[c] || 1.0,
                createdAt: now,
                updatedAt: now
            }));
            await queryInterface.bulkInsert("countries", countryPayloads, { transaction });

            // Seed designations
            const desigPayloads = DESIGNATIONS.map(d => ({
                title: d.title,
                minSalary: d.minSalary,
                maxSalary: d.maxSalary,
                createdAt: now,
                updatedAt: now
            }));
            await queryInterface.bulkInsert("designations", desigPayloads, { transaction });
        });

        // 2. Fetch seeded lookup values to map them
        const departments = await queryInterface.sequelize.query(
            `SELECT id, name FROM departments`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        const countries = await queryInterface.sequelize.query(
            `SELECT id, name, currency, exchangeRate FROM countries`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        const designations = await queryInterface.sequelize.query(
            `SELECT id, title, minSalary, maxSalary FROM designations`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );
        const employmentTypes = await queryInterface.sequelize.query(
            `SELECT id, name FROM employment_types`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        const lookupDb = {
            departments,
            countries,
            designations,
            employmentTypes
        };

        const employees = [];
        const salaryHistories = [];

        for (let i = 0; i < 10000; i++) {

            const employee = generateEmployee(i, lookupDb);

            employees.push({
                employeeCode: employee.employeeCode,
                firstName: employee.firstName,
                lastName: employee.lastName,
                email: employee.email,
                gender: employee.gender,
                departmentId: employee.departmentId,
                designationId: employee.designationId,
                employmentTypeId: employee.employmentTypeId,
                employmentStatus: employee.employmentStatus,
                joiningDate: employee.joiningDate,
                countryId: employee.countryId,
                workLocation: employee.workLocation,
                managerId: employee.managerId,
                createdAt: now,
                updatedAt: now
            });

            const salary = generateSalary(employee);

            salaryHistories.push({
                employeeId: i + 1,
                salary: salary.salary,
                currency: salary.currency,
                effectiveDate: salary.effectiveDate,
                revisionReason: salary.revisionReason,
                createdAt: now,
                updatedAt: now
            });

        }

        // 3. Seed employees and salaries
        await queryInterface.sequelize.transaction(async (transaction) => {

            await queryInterface.bulkInsert(
                "employees",
                employees,
                {
                    transaction
                }
            );

            await queryInterface.bulkInsert(
                "salary_histories",
                salaryHistories,
                {
                    transaction
                }
            );

        });

    },

    async down(queryInterface) {

        await queryInterface.bulkDelete("salary_histories", null, {});
        await queryInterface.bulkDelete("employees", null, {});
        await queryInterface.bulkDelete("designations", null, {});
        await queryInterface.bulkDelete("countries", null, {});
        await queryInterface.bulkDelete("employment_types", null, {});
        await queryInterface.bulkDelete("departments", null, {});

    }

};
