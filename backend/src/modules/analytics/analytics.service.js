const { ApiError } = require("../../utils");
const { HTTP_STATUS } = require("../../utils/constants");

class AnalyticsService {
    constructor(analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    async getDashboardStats(filters = {}) {
        try {
            const where = {};

            if (filters.countryId) {
                where.countryId = parseInt(filters.countryId, 10);
            }
            if (filters.departmentId) {
                where.departmentId = parseInt(filters.departmentId, 10);
            }
            if (filters.employmentTypeId) {
                where.employmentTypeId = parseInt(filters.employmentTypeId, 10);
            }

            const employees = await this.analyticsRepository.getEmployeesWithLatestSalary(where);

            if (employees.length === 0) {
                return {
                    summary: { totalEmployees: 0, averageSalaryINR: 0, totalPayrollINR: 0 },
                    payrollByCountry: [],
                    payrollByDepartment: [],
                    salaryDistribution: { "0-10L": 0, "10L-20L": 0, "20L-30L": 0, "30L+": 0 },
                    highestPaid: []
                };
            }

            let totalSalaryINR = 0;
            const countryPayroll = {};
            const deptPayroll = {};
            const distribution = {
                "0-10L": 0,
                "10L-20L": 0,
                "20L-30L": 0,
                "30L+": 0
            };

            const employeesWithINR = employees.map(empInstance => {
                const emp = empInstance.get({ plain: true });
                const activeSalaryRecord = emp.salaryHistory && emp.salaryHistory[0]
                    ? emp.salaryHistory[0]
                    : { salary: 0, currency: "INR" };
                const currency = activeSalaryRecord.currency;
                const salary = parseFloat(activeSalaryRecord.salary);

                // Fetch exchange rate dynamically from the Country model
                const rate = emp.country ? parseFloat(emp.country.exchangeRate) : 1.0;
                const salaryINR = salary * rate;
                totalSalaryINR += salaryINR;

                const countryName = emp.country ? emp.country.name : "Unknown";
                if (!countryPayroll[countryName]) {
                    countryPayroll[countryName] = { totalINR: 0, count: 0, currencies: {} };
                }
                countryPayroll[countryName].totalINR += salaryINR;
                countryPayroll[countryName].count += 1;
                if (!countryPayroll[countryName].currencies[currency]) {
                    countryPayroll[countryName].currencies[currency] = 0;
                }
                countryPayroll[countryName].currencies[currency] += salary;

                const deptName = emp.department ? emp.department.name : "Unknown";
                if (!deptPayroll[deptName]) {
                    deptPayroll[deptName] = { totalINR: 0, count: 0 };
                }
                deptPayroll[deptName].totalINR += salaryINR;
                deptPayroll[deptName].count += 1;

                if (salaryINR <= 1000000) {
                    distribution["0-10L"] += 1;
                } else if (salaryINR <= 2000000) {
                    distribution["10L-20L"] += 1;
                } else if (salaryINR <= 3000000) {
                    distribution["20L-30L"] += 1;
                } else {
                    distribution["30L+"] += 1;
                }

                return {
                    id: emp.id,
                    firstName: emp.firstName,
                    lastName: emp.lastName,
                    designation: emp.designation ? emp.designation.title : "Unknown",
                    department: deptName,
                    country: countryName,
                    salary,
                    currency,
                    salaryINR
                };
            });

            const formattedCountryPayroll = Object.keys(countryPayroll).map(country => ({
                country,
                totalPayrollINR: Math.round(countryPayroll[country].totalINR * 100) / 100,
                employeeCount: countryPayroll[country].count,
                localCurrencies: countryPayroll[country].currencies
            })).sort((a, b) => b.totalPayrollINR - a.totalPayrollINR);

            const formattedDeptPayroll = Object.keys(deptPayroll).map(dept => ({
                department: dept,
                totalPayrollINR: Math.round(deptPayroll[dept].totalINR * 100) / 100,
                employeeCount: deptPayroll[dept].count
            })).sort((a, b) => b.totalPayrollINR - a.totalPayrollINR);

            const highestPaid = [...employeesWithINR]
                .sort((a, b) => b.salaryINR - a.salaryINR)
                .slice(0, 10)
                .map(emp => ({
                    id: emp.id,
                    firstName: emp.firstName,
                    lastName: emp.lastName,
                    designation: emp.designation,
                    department: emp.department,
                    country: emp.country,
                    salary: emp.salary,
                    currency: emp.currency,
                    salaryINR: Math.round(emp.salaryINR * 100) / 100
                }));

            const totalEmployees = employees.length;

            return {
                summary: {
                    totalEmployees,
                    totalPayrollINR: Math.round(totalSalaryINR * 100) / 100,
                    averageSalaryINR: Math.round((totalSalaryINR / totalEmployees) * 100) / 100
                },
                payrollByCountry: formattedCountryPayroll,
                payrollByDepartment: formattedDeptPayroll,
                salaryDistribution: distribution,
                highestPaid
            };
        } catch (error) {
            throw new ApiError(
                error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
                error.message || "Internal Server Error"
            );
        }
    }
}

module.exports = AnalyticsService;
