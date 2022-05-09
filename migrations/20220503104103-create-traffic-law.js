"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TrafficLaws", {
      trafficId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      trafficLaw: {
        type: Sequelize.JSON,
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
    await queryInterface.dropTable("TrafficLaws");
  },
};
