'use strict';

const bcrypt = require('bcrypt');

const ID = '75b76701-3bb7-465d-9d23-ebecfde98bee';
const PASSWORD = '007GoldenEye';
const SALT_ROUNDS = 10;

// Esse ID deve bater com uma store do seu seeder de stores
const STORE_ID = 'a1b2c3d4-e5f6-7890-abcd-ef0123456789';

const CREATED_AT = new Date();
const UPDATED_AT = CREATED_AT;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert(
        'users',
        [
          {
            id: ID,
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: bcrypt.hashSync(PASSWORD, SALT_ROUNDS),
            coins: 0,
            in_game_coins: 0,
            store_id: STORE_ID,
            user_role: 'store_customer',
            createdAt: CREATED_AT,
            updatedAt: UPDATED_AT,
            deletedAt: null,
          },
        ],
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete('users', { id: ID }, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      throw error;
    }
  },
};
