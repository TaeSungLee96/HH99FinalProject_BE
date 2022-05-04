"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Banks", {
      bankId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      bankRequirePaper: {
        type: Sequelize.STRING,
      },
      mainBank: {
        type: Sequelize.STRING,
      },
      bankStep: {
        type: Sequelize.STRING,
      },
      bankCaution: {
        type: Sequelize.STRING,
      },
      accountType: {
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
    await queryInterface.dropTable("Banks");
  },
};
