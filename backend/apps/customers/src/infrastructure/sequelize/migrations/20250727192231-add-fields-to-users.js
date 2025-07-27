'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'users',
        'coins',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'users',
        'in_game_coins',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'users',
        'store_id',
        {
          type: Sequelize.UUID,
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'users',
        'user_role',
        {
          type: Sequelize.ENUM('store_customer', 'store_admin', 'admin'),
          allowNull: false,
          defaultValue: 'store_customer',
        },
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
      await queryInterface.removeColumn('users', 'user_role', { transaction });
      await queryInterface.removeColumn('users', 'store_id', { transaction });
      await queryInterface.removeColumn('users', 'in_game_coins', { transaction });
      await queryInterface.removeColumn('users', 'coins', { transaction });

      // Importante: remove o ENUM manualmente
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS enum_users_user_role;',
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      throw error;
    }
  },
};
