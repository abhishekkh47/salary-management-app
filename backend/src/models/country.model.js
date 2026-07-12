const { Model } = require("sequelize");

class Country extends Model {
    static initialize(sequelize, DataTypes) {
        Country.init(
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
                },
                currency: {
                    type: DataTypes.STRING(3),
                    allowNull: false
                },
                exchangeRate: {
                    type: DataTypes.DECIMAL(10, 4),
                    allowNull: false
                }
            },
            {
                sequelize,
                modelName: "Country",
                tableName: "countries",
                timestamps: true
            }
        );
    }

    static associate(models) {
        Country.hasMany(models.Employee, {
            foreignKey: "countryId",
            as: "employees"
        });
    }
}

module.exports = Country;
