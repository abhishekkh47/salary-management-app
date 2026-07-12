"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("designations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      minSalary: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      maxSalary: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("designations");
  }
};
