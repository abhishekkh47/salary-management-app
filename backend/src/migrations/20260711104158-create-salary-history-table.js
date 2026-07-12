"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("salary_histories", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      employeeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "employees",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      salary: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false
      },
      effectiveDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      revisionReason: {
        type: Sequelize.ENUM(
          "JOINING",
          "PROMOTION",
          "ANNUAL_REVIEW",
          "MARKET_ADJUSTMENT",
          "OTHER"
        ),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });

    // Add index for optimized queries
    await queryInterface.addIndex("salary_histories", ["employeeId", "effectiveDate", "createdAt"], {
      name: "salary_histories_employee_date_idx"
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("salary_histories");
  }
};