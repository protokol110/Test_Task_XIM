'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Files', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            fileName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            mimeType: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            extension: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            fileSize: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            filePath: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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

    async down(queryInterface) {
        await queryInterface.dropTable('Files');
    }
};
