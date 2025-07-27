'use strict';

const GAME = {
  id: 1,
  title: 'Check-in',
  description: 'Faça check-in e receba moedas diariamente para usar como desconto em compras',
  created_at: new Date(),
  updated_at: new Date(),
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert('games', [GAME], { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('games', { id: GAME.id }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};