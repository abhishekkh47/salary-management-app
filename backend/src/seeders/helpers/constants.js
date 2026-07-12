const {
    EmploymentType,
    EmploymentStatus,
    Gender,
    SalaryRevisionReason
} = require("../../utils/constants");

module.exports = {

    COUNTRIES: [
        "India",
        "USA",
        "UK",
        "Germany",
        "Canada",
        "Australia"
    ],

    LOCATIONS: {

        India: [
            "Ahmedabad",
            "Bengaluru",
            "Hyderabad",
            "Pune",
            "Mumbai",
            "Chennai",
            "Delhi",
            "Kolkata"
        ],

        USA: [
            "New York",
            "Seattle",
            "Austin",
            "San Francisco",
            "Chicago"
        ],

        UK: [
            "London",
            "Manchester",
            "Birmingham"
        ],

        Germany: [
            "Berlin",
            "Munich",
            "Frankfurt"
        ],

        Canada: [
            "Toronto",
            "Vancouver",
            "Montreal"
        ],

        Australia: [
            "Sydney",
            "Melbourne",
            "Perth"
        ]

    },

    CURRENCIES: {

        India: "INR",
        USA: "USD",
        UK: "GBP",
        Germany: "EUR",
        Canada: "CAD",
        Australia: "AUD"

    },

    DEPARTMENTS: [

        {
            name: "Engineering",
            weight: 45
        },

        {
            name: "Product",
            weight: 12
        },

        {
            name: "Sales",
            weight: 15
        },

        {
            name: "Marketing",
            weight: 8
        },

        {
            name: "Finance",
            weight: 6
        },

        {
            name: "HR",
            weight: 6
        },

        {
            name: "Operations",
            weight: 5
        },

        {
            name: "Support",
            weight: 3
        }

    ],

    DESIGNATIONS: [

        {
            title: "Intern",
            minSalary: 250000,
            maxSalary: 400000,
            weight: 5
        },

        {
            title: "Software Engineer",
            minSalary: 600000,
            maxSalary: 1200000,
            weight: 55
        },

        {
            title: "Senior Software Engineer",
            minSalary: 1200000,
            maxSalary: 1800000,
            weight: 25
        },

        {
            title: "Engineering Manager",
            minSalary: 1800000,
            maxSalary: 3000000,
            weight: 10
        },

        {
            title: "Director",
            minSalary: 3000000,
            maxSalary: 6000000,
            weight: 5
        }

    ],

    EMPLOYMENT_TYPES: [

        {
            value: EmploymentType.FULL_TIME,
            weight: 85
        },

        {
            value: EmploymentType.CONTRACTOR,
            weight: 10
        },

        {
            value: EmploymentType.INTERN,
            weight: 5
        }

    ],

    EMPLOYMENT_STATUS: EmploymentStatus.ACTIVE,

    GENDERS: [
        Gender.MALE,
        Gender.FEMALE,
        Gender.OTHER
    ],

    SALARY_REVISION_REASON: SalaryRevisionReason.JOINING

};