'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcrypt")
module.exports = {
  async up (queryInterface, Sequelize) {
    let hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    await queryInterface.bulkInsert('Admin', [{
      name: "Admin",
      email:  process.env.ADMIN_MAIL,
      password: hash,
      lang_key: 'EN',
      createdAt: Sequelize.literal("CURRENT_TIMESTAMP"),
      updatedAt : Sequelize.literal("CURRENT_TIMESTAMP")
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admin', null, {});
  }
};
