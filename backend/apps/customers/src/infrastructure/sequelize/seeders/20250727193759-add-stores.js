'use strict';

const { v4: uuidv4 } = require('uuid');

const STORES = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789',
    name: 'Mercato Online',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  },
  {
    id: uuidv4(),
    name: 'Loja Filial 1',
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  },
];
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert('store_stub', STORES, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      console.error(err);
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Remove todas as stores que inserimos
      await queryInterface.bulkDelete(
        'store_stub',
        { id: STORES.map(store => store.id) },
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      console.error(err);
      throw err;
    }
  },
};
