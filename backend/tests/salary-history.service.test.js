process.env.NODE_ENV = "test";
const { initTestDb, sequelize, models } = require("./testHelper");
const EmployeeRepository = require("../src/modules/employees/employee.repository");
const SalaryHistoryRepository = require("../src/modules/salaries/salary-history.repository");
const SalaryHistoryService = require("../src/modules/salaries/salary-history.service");
const EmployeeService = require("../src/modules/employees/employee.service");

describe("SalaryHistoryService", () => {
    let salaryHistoryService;
    let salaryHistoryRepository;
    let employeeRepository;
    let employeeService;
    let seeds;
    let testEmployee;

    beforeAll(async () => {
        employeeRepository = new EmployeeRepository();
        salaryHistoryRepository = new SalaryHistoryRepository();
        salaryHistoryService = new SalaryHistoryService(salaryHistoryRepository, employeeRepository, sequelize);
        employeeService = new EmployeeService(employeeRepository, salaryHistoryRepository, sequelize);
    });

    beforeEach(async () => {
        seeds = await initTestDb();

        // Create a test employee working in India (currency: INR)
        testEmployee = await employeeService.create({
            employeeCode: "EMP00001",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            gender: "MALE",
            departmentId: seeds.departmentId,
            designationId: seeds.designationId,
            employmentTypeId: seeds.employmentTypeId,
            joiningDate: new Date(),
            countryId: seeds.countryInId, // India
            workLocation: "Mumbai",
            salary: 50000,
            currency: "INR",
            effectiveDate: new Date()
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe("create", () => {
        it("should successfully record a new salary revision with matching currency", async () => {
            const payload = {
                employeeId: testEmployee.id,
                salary: 60000,
                currency: "INR",
                effectiveDate: new Date(),
                revisionReason: "ANNUAL_REVIEW"
            };

            const revision = await salaryHistoryService.addRecord(testEmployee.id, payload);

            expect(revision).toBeDefined();
            expect(parseFloat(revision.salary)).toBe(60000);
            expect(revision.currency).toBe("INR");

            // Verify count in DB
            const count = await models.SalaryHistory.count({
                where: { employeeId: testEmployee.id }
            });
            expect(count).toBe(2); // Initial (1) + Revision (1)
        });

        it("should reject salary revision if currency doesn't match employee's country currency", async () => {
            const payload = {
                salary: 750, // in USD
                currency: "USD", // Mismatch! Employee is in India (INR)
                effectiveDate: new Date(),
                revisionReason: "ANNUAL_REVIEW"
            };

            await expect(salaryHistoryService.addRecord(testEmployee.id, payload)).rejects.toThrow(
                "Currency must match country currency: INR"
            );
        });

        it("should throw error if employee is not found", async () => {
            const payload = {
                salary: 60000,
                currency: "INR",
                effectiveDate: new Date(),
                revisionReason: "ANNUAL_REVIEW"
            };

            await expect(salaryHistoryService.addRecord(99999, payload)).rejects.toThrow("Employee not found");
        });
    });
});
