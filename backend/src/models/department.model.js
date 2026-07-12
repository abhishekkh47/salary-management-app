const { Model } = require("sequelize");

class Department extends Model {
    static initialize(sequelize, DataTypes) {
        Department.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                }
            },
            {
                sequelize,
                modelName: "Department",
                tableName: "departments",
                timestamps: true
            }
        );
    }

    static associate(models) {
        Department.hasMany(models.Employee, {
            foreignKey: "departmentId",
            as: "employees"
        });
    }
}

module.exports = Department;
