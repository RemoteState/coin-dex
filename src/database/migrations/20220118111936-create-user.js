'use strict';
const {DataTypes} = require("sequelize");
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('user', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            pub_key: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            channel_status: {
                type: DataTypes.ENUM,
                values: [
                    'private',
                    'open',
                    'not_connected'
                ],
                default: 'not_connected'
            },
            role: {
                type: DataTypes.ENUM,
                values: [
                    'user',
                    'admin'
                ],
                default: 'user'
            },
            credit: {
                type: Sequelize.DOUBLE
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('user');
    }
};
