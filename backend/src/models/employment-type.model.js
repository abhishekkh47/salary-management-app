const { Model } = require("sequelize");

class EmploymentType extends Model {
    static initialize(sequelize, DataTypes) {
        EmploymentType.init(
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
                modelName: "EmploymentType",
                tableName: "employment_types",
                timestamps: true
            }
        );
    }

    static associate(models) {
        EmploymentType.hasMany(models.Employee, {
            foreignKey: "employmentTypeId",
            as: "employees"
        });
    }
}

module.exports = EmploymentType;
