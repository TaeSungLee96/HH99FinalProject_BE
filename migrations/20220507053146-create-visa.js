"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Visas", {
      visaId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      workVisa: {
        type: Sequelize.JSON,
      },
      immigrationVis: {
        type: Sequelize.JSON,
      },
      workingHolidayVisa: {
        type: Sequelize.JSON,
      },
      studyVisa: {
        type: Sequelize.JSON,
      },
      name: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Visas");
  },
};
