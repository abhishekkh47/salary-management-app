"use strict";

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
        type: Sequelize.ENUM("Male", "Female", "Other"),
        allowNull: false
      },

      department: {
        type: Sequelize.STRING,
        allowNull: false
      },

      designation: {
        type: Sequelize.STRING,
        allowNull: false
      },

      employmentType: {
        type: Sequelize.ENUM(
          "FULL_TIME",
          "CONTRACTOR",
          "INTERN"
        ),
        allowNull: false
      },

      employmentStatus: {
        type: Sequelize.ENUM(
          "ACTIVE",
          "INACTIVE"
        ),
        allowNull: false,
        defaultValue: "ACTIVE"
      },

      joiningDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      country: {
        type: Sequelize.STRING,
        allowNull: false
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable("employees");
  }
};