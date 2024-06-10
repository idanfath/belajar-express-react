'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for (let i = 0; i < 20; i++) {
      await queryInterface.bulkInsert('Artikels', [{
        nis: `123456789${i}`,
        nama: `nama${i}`,
        jurusan: `seeded`,
        alamat: `alamat${i}`,
        email: `email${i}@gmail.com`,
        phone: `0812345678${i}`,
      }]);
    }
  },

  async down (queryInterface, Sequelize) {
    // delete all data with jurusan seeded
    await queryInterface.bulkDelete('Artikels', {
      jurusan: 'seeded'
    });
  }
};
