const { Model } = require("sequelize");

class Designation extends Model {
    static initialize(sequelize, DataTypes) {
        Designation.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                title: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                },
                minSalary: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: false
                },
                maxSalary: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: false
                }
            },
            {
                sequelize,
                modelName: "Designation",
                tableName: "designations",
                timestamps: true
            }
        );
    }

    static associate(models) {
        Designation.hasMany(models.Employee, {
            foreignKey: "designationId",
            as: "employees"
        });
    }
}

module.exports = Designation;
