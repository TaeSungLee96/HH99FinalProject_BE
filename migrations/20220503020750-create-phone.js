"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Phones", {
      phoneId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      phoneOpeningMethod: {
        type: Sequelize.STRING,
      },
      mainTelecom: {
        type: Sequelize.STRING,
      },
      recommendPlan: {
        type: Sequelize.STRING,
      },
      countryId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Phones");
  },
};
