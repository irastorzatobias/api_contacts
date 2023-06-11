'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
        await queryInterface.bulkInsert('Contacts', [
            {
                userId: 1,
                name: 'John Doe',
                mail: '',
                phone: '123456789',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 1,
                name: 'Jane Doe',
                mail: '',
                phone: '987654321',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                userId: 2,
                name: 'Toby Doe',
                mail: '',
                phone: '987654321',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
        await queryInterface.bulkDelete('Contacts', null, {}); // eslint-disable-line no-undef
    }
};
