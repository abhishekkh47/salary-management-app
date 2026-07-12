process.env.NODE_ENV = "test";
const { initTestDb, sequelize, models } = require("./testHelper");
const EmployeeRepository = require("../src/modules/employees/employee.repository");
const SalaryHistoryRepository = require("../src/modules/salaries/salary-history.repository");
const EmployeeService = require("../src/modules/employees/employee.service");
const AnalyticsRepository = require("../src/modules/analytics/analytics.repository");
const AnalyticsService = require("../src/modules/analytics/analytics.service");

describe("AnalyticsService", () => {
    let analyticsService;
    let analyticsRepository;
    let employeeService;
    let seeds;

    beforeAll(async () => {
        const employeeRepository = new EmployeeRepository();
        const salaryHistoryRepository = new SalaryHistoryRepository();
        employeeService = new EmployeeService(employeeRepository, salaryHistoryRepository, sequelize);
        
        analyticsRepository = new AnalyticsRepository(sequelize);
        analyticsService = new AnalyticsService(analyticsRepository);
    });

    beforeEach(async () => {
        seeds = await initTestDb();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe("getDashboardStats", () => {
        it("should calculate correct headcount, averages, and country breakdowns", async () => {
            // Seed a few employees:
            // 2 in India (INR), 1 in USA (USD)
            await employeeService.create({
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

            await employeeService.create({
                employeeCode: "EMP00002",
                firstName: "Jane",
                lastName: "Smith",
                email: "jane.smith@example.com",
                gender: "FEMALE",
                departmentId: seeds.departmentId,
                designationId: seeds.designationId,
                employmentTypeId: seeds.employmentTypeId,
                joiningDate: new Date(),
                countryId: seeds.countryInId, // India
                workLocation: "Bangalore",
                salary: 70000,
                currency: "INR",
                effectiveDate: new Date()
            });

            await employeeService.create({
                employeeCode: "EMP00003",
                firstName: "Alice",
                lastName: "Johnson",
                email: "alice.j@example.com",
                gender: "FEMALE",
                departmentId: seeds.departmentId,
                designationId: seeds.designationId,
                employmentTypeId: seeds.employmentTypeId,
                joiningDate: new Date(),
                countryId: seeds.countryUsId, // USA
                workLocation: "New York",
                salary: 5000,
                currency: "USD",
                effectiveDate: new Date()
            });

            const stats = await analyticsService.getDashboardStats();

            expect(stats).toBeDefined();
            expect(stats.totalEmployees).toBe(3);
            expect(stats.activeEmployees).toBe(3);
            expect(stats.inactiveEmployees).toBe(0);

            // Total Payroll INR = (50000 + 70000) + (5000 * 83.0 [exchange rate])
            // 120000 + 415000 = 535000
            expect(Math.round(stats.totalPayroll)).toBe(535000);
            
            // Average Salary INR = 535000 / 3 = 178333.33
            expect(Math.round(stats.averageSalary)).toBe(Math.round(535000 / 3));

            // Verify country breakdown details
            expect(stats.byCountry).toBeDefined();
            expect(stats.byCountry).toHaveLength(2); // India, USA
        });
    });
});
