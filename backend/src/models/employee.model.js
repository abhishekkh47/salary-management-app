const { Model } = require("sequelize");

const {
    Gender,
    EmploymentStatus
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
                    type: DataTypes.ENUM(Object.values(Gender)),
                    allowNull: false
                },
                departmentId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "departments",
                        key: "id"
                    }
                },
                designationId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "designations",
                        key: "id"
                    }
                },
                employmentTypeId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "employment_types",
                        key: "id"
                    }
                },
                employmentStatus: {
                    type: DataTypes.ENUM(Object.values(EmploymentStatus)),
                    defaultValue: EmploymentStatus.ACTIVE,
                    allowNull: false
                },
                joiningDate: {
                    type: DataTypes.DATEONLY,
                    allowNull: false
                },
                countryId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: "countries",
                        key: "id"
                    }
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

    static associate(models) {
        Employee.belongsTo(models.Department, {
            foreignKey: "departmentId",
            as: "department"
        });
        Employee.belongsTo(models.Designation, {
            foreignKey: "designationId",
            as: "designation"
        });
        Employee.belongsTo(models.EmploymentType, {
            foreignKey: "employmentTypeId",
            as: "employmentType"
        });
        Employee.belongsTo(models.Country, {
            foreignKey: "countryId",
            as: "country"
        });
        Employee.hasMany(models.SalaryHistory, {
            foreignKey: "employeeId",
            as: "salaryHistory"
        });
    }
}

module.exports = Employee;