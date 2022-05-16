"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("baseInfos", {
      baseInfoId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      countryName: {
        type: Sequelize.JSON,
      },
      baseInfo: {
        type: Sequelize.JSON,
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
    await queryInterface.dropTable("baseInfos");
  },
};
