process.env.NODE_ENV = "test";
const { initTestDb, sequelize, models } = require("./testHelper");
const EmployeeRepository = require("../src/modules/employees/employee.repository");
const SalaryHistoryRepository = require("../src/modules/salaries/salary-history.repository");
const EmployeeService = require("../src/modules/employees/employee.service");

describe("EmployeeService", () => {
    let employeeService;
    let employeeRepository;
    let salaryHistoryRepository;
    let seeds;

    beforeAll(async () => {
        employeeRepository = new EmployeeRepository();
        salaryHistoryRepository = new SalaryHistoryRepository();
        employeeService = new EmployeeService(employeeRepository, salaryHistoryRepository, sequelize);
    });

    beforeEach(async () => {
        seeds = await initTestDb();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe("create", () => {
        it("should successfully register a new employee and initial salary record", async () => {
            const payload = {
                employeeCode: "EMP00001",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                gender: "MALE",
                departmentId: seeds.departmentId,
                designationId: seeds.designationId,
                employmentTypeId: seeds.employmentTypeId,
                joiningDate: new Date(),
                countryId: seeds.countryInId,
                workLocation: "Mumbai",
                salary: 50000,
                currency: "INR",
                effectiveDate: new Date()
            };

            const employee = await employeeService.create(payload);

            expect(employee).toBeDefined();
            expect(employee.employeeCode).toBe("EMP00001");
            expect(employee.firstName).toBe("John");
            expect(employee.email).toBe("john.doe@example.com");

            // Verify initial salary record
            const salaryHistory = await models.SalaryHistory.findAll({
                where: { employeeId: employee.id }
            });
            expect(salaryHistory).toHaveLength(1);
            expect(parseFloat(salaryHistory[0].salary)).toBe(50000);
            expect(salaryHistory[0].currency).toBe("INR");
        });

        it("should reject creation if employeeCode already exists", async () => {
            const payload1 = {
                employeeCode: "EMP00001",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                gender: "MALE",
                departmentId: seeds.departmentId,
                designationId: seeds.designationId,
                employmentTypeId: seeds.employmentTypeId,
                joiningDate: new Date(),
                countryId: seeds.countryInId,
                workLocation: "Mumbai",
                salary: 50000,
                currency: "INR",
                effectiveDate: new Date()
            };

            await employeeService.create(payload1);

            const payload2 = {
                ...payload1,
                email: "another@example.com"
            };

            await expect(employeeService.create(payload2)).rejects.toThrow("Employee code already exists");
        });

        it("should resolve managerId using EMPXXXXX employeeCode format", async () => {
            // Register Manager first
            const managerPayload = {
                employeeCode: "EMP00001",
                firstName: "Manager",
                lastName: "One",
                email: "manager@example.com",
                gender: "MALE",
                departmentId: seeds.departmentId,
                designationId: seeds.designationId,
                employmentTypeId: seeds.employmentTypeId,
                joiningDate: new Date(),
                countryId: seeds.countryInId,
                workLocation: "Mumbai",
                salary: 90000,
                currency: "INR",
                effectiveDate: new Date()
            };
            const manager = await employeeService.create(managerPayload);

            // Register Subordinate reporting to EMP00001
            const subordinatePayload = {
                employeeCode: "EMP00002",
                firstName: "Subordinate",
                lastName: "One",
                email: "subordinate@example.com",
                gender: "FEMALE",
                departmentId: seeds.departmentId,
                designationId: seeds.designationId,
                employmentTypeId: seeds.employmentTypeId,
                joiningDate: new Date(),
                countryId: seeds.countryInId,
                workLocation: "Mumbai",
                salary: 40000,
                currency: "INR",
                effectiveDate: new Date(),
                managerId: "EMP00001" // string code
            };

            const subordinate = await employeeService.create(subordinatePayload);
            expect(subordinate.managerId).toBe(manager.id);
        });

        it("should throw error if managerCode is not found", async () => {
            const payload = {
                employeeCode: "EMP00002",
                firstName: "Sub",
                lastName: "One",
                email: "sub@example.com",
                gender: "FEMALE",
                departmentId: seeds.departmentId,
                designationId: seeds.designationId,
                employmentTypeId: seeds.employmentTypeId,
                joiningDate: new Date(),
                countryId: seeds.countryInId,
                workLocation: "Mumbai",
                salary: 40000,
                currency: "INR",
                effectiveDate: new Date(),
                managerId: "EMP99999" // non-existent code
            };

            await expect(employeeService.create(payload)).rejects.toThrow("Manager not found");
        });
    });

    describe("update", () => {
        it("should successfully update details and prevent self-manager assignment", async () => {
            const employeePayload = {
                employeeCode: "EMP00001",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                gender: "MALE",
                departmentId: seeds.departmentId,
                designationId: seeds.designationId,
                employmentTypeId: seeds.employmentTypeId,
                joiningDate: new Date(),
                countryId: seeds.countryInId,
                workLocation: "Mumbai",
                salary: 50000,
                currency: "INR",
                effectiveDate: new Date()
            };

            const employee = await employeeService.create(employeePayload);

            // Attempt self manager update using self code
            await expect(employeeService.update(employee.id, {
                managerId: "EMP00001"
            })).rejects.toThrow("An employee cannot be their own manager");

            // Successful name update
            const updated = await employeeService.update(employee.id, {
                firstName: "Johnny"
            });
            expect(updated.firstName).toBe("Johnny");
        });

        it("should append a new salary timeline record when updating salary fields", async () => {
            const employeePayload = {
                employeeCode: "EMP00001",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                gender: "MALE",
                departmentId: seeds.departmentId,
                designationId: seeds.designationId,
                employmentTypeId: seeds.employmentTypeId,
                joiningDate: new Date(),
                countryId: seeds.countryInId,
                workLocation: "Mumbai",
                salary: 50000,
                currency: "INR",
                effectiveDate: new Date()
            };

            const employee = await employeeService.create(employeePayload);

            // Revise salary during update details call
            await employeeService.update(employee.id, {
                salary: 65000,
                currency: "INR",
                effectiveDate: new Date(),
                revisionReason: "PROMOTION"
            });

            // Verify salary history has 2 records now
            const history = await models.SalaryHistory.findAll({
                where: { employeeId: employee.id }
            });
            expect(history).toHaveLength(2);
            expect(parseFloat(history[0].salary)).toBe(50000);
            expect(parseFloat(history[1].salary)).toBe(65000);
            expect(history[1].revisionReason).toBe("PROMOTION");
        });
    });
});
