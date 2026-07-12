const { Model } = require("sequelize");

const { SalaryRevisionReason } = require("../utils/constants");

class SalaryHistory extends Model {
    static initialize(sequelize, DataTypes) {
        SalaryHistory.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                employeeId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                salary: {
                    type: DataTypes.DECIMAL(12, 2),
                    allowNull: false,
                    validate: {
                        min: 0,
                    },
                },
                currency: {
                    type: DataTypes.STRING(3),
                    allowNull: false,
                },
                effectiveDate: {
                    type: DataTypes.DATEONLY,
                    allowNull: false,
                },
                revisionReason: {
                    type: DataTypes.ENUM(Object.values(SalaryRevisionReason)),
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: "SalaryHistory",
                tableName: "salary_histories",
                timestamps: true,
                paranoid: true,
            }
        );
    }

    static associate(models) {
        SalaryHistory.belongsTo(models.Employee, {
            foreignKey: "employeeId",
            as: "employee",
        });
    }
}

module.exports = SalaryHistory;