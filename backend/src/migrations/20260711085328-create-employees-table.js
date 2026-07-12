"use strict";

const { Gender, EmploymentStatus } = require("../utils/constants");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("employees", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employeeCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      gender: {
        type: Sequelize.ENUM(Object.values(Gender)),
        allowNull: false
      },
      departmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "departments",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      designationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "designations",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      employmentTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "employment_types",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      employmentStatus: {
        type: Sequelize.ENUM(Object.values(EmploymentStatus)),
        allowNull: false,
        defaultValue: EmploymentStatus.ACTIVE
      },
      joiningDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      countryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "countries",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      workLocation: {
        type: Sequelize.STRING,
        allowNull: false
      },
      managerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "employees",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
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

    // Add indexes for optimization
    await queryInterface.addIndex("employees", ["departmentId"]);
    await queryInterface.addIndex("employees", ["countryId"]);
    await queryInterface.addIndex("employees", ["employmentTypeId"]);
    await queryInterface.addIndex("employees", ["designationId"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("employees");
  }
};