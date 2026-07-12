const { faker } = require("@faker-js/faker");

const {
    COUNTRIES,
    LOCATIONS,
    CURRENCIES,
    DEPARTMENTS,
    DESIGNATIONS,
    EMPLOYMENT_TYPES,
    EMPLOYMENT_STATUS,
    GENDERS
} = require("../../utils/constants");

function weightedRandom(items) {

    const totalWeight = items.reduce(
        (sum, item) => sum + item.weight,
        0
    );

    let random = Math.random() * totalWeight;

    for (const item of items) {

        random -= item.weight;

        if (random <= 0) {
            return item;
        }

    }

    return items[items.length - 1];

}

function randomItem(array) {
    return array[
        Math.floor(Math.random() * array.length)
    ];
}

function randomSalary(min, max) {

    return Number(
        (
            Math.random() * (max - min) + min
        ).toFixed(2)
    );

}

function generateManagerId(index) {

    if (index === 0) {
        return null;
    }

    if (index < 10) {
        return 1;
    }

    if (index < 100) {
        return Math.floor(Math.random() * 9) + 2;
    }

    return Math.floor(Math.random() * index) + 1;

}

function generateEmployee(index, lookupDb) {
    const country = randomItem(COUNTRIES);
    const location = randomItem(
        LOCATIONS[country]
    );
    const department = weightedRandom(
        DEPARTMENTS
    );
    const designation = weightedRandom(
        DESIGNATIONS
    );
    const employmentType = weightedRandom(
        EMPLOYMENT_TYPES
    );
    const joiningDate = faker.date.between({
        from: "2018-01-01",
        to: "2025-01-01"
    });

    const currency = CURRENCIES[country];
    const dbCountry = lookupDb.countries.find(c => c.name === country);
    const rate = dbCountry ? parseFloat(dbCountry.exchangeRate) : 1.0;
    const baseSalary = randomSalary(
        designation.minSalary,
        designation.maxSalary
    );
    const salary = Number((baseSalary / rate).toFixed(2));

    const dbDept = lookupDb.departments.find(d => d.name === department.name);
    const dbDesig = lookupDb.designations.find(d => d.title === designation.title);
    const dbEmpType = lookupDb.employmentTypes.find(t => t.name === employmentType.value);

    return {
        id: index + 1,
        employeeCode: `EMP${String(index + 1).padStart(5, "0")}`,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: `employee${index + 1}@acme.com`,
        gender: randomItem(GENDERS),
        departmentId: dbDept.id,
        designationId: dbDesig.id,
        employmentTypeId: dbEmpType.id,
        employmentStatus: EMPLOYMENT_STATUS,
        joiningDate,
        countryId: dbCountry.id,
        workLocation: location,
        managerId: generateManagerId(index),
        salary,
        currency

    };

}

module.exports = generateEmployee;
