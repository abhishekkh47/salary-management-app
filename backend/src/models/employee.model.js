const { Model } = require("sequelize");

const {
    Gender,
    EmploymentStatus,
    EmploymentType
} = require("../utils/constants");

class Employee extends Model {
    static initialize(sequelize, DataTypes) {
        Employee.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                employeeCode: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                },
                firstName: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                lastName: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                    validate: {
                        isEmail: true
                    }
                },
                gender: {
                    type: DataTypes.ENUM(...Gender.values()),
                    allowNull: false
                },
                department: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                designation: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                employmentType: {
                    type: DataTypes.ENUM(...EmploymentType.values()),
                    allowNull: false
                },
                employmentStatus: {
                    type: DataTypes.ENUM(...EmploymentStatus.values()),
                    defaultValue: EmploymentStatus.ACTIVE,
                    allowNull: false
                },
                joiningDate: {
                    type: DataTypes.DATEONLY,
                    allowNull: false
                },
                country: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                workLocation: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                managerId: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                }
            },
            {
                sequelize,
                modelName: "Employee",
                tableName: "employees",
                timestamps: true,
                paranoid: true
            }
        );
    }
}

module.exports = Employee;