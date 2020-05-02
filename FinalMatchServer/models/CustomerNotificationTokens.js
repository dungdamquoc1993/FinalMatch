const { Sequelize, DataTypes, Model } = require('sequelize')
const {sequelize} = require('../database/database')
module.exports = sequelize.define('CustomerNotificationTokens', {
	token: {
		type: DataTypes.STRING(500),
		allowNull: true
	},
	customerId: {
		type: DataTypes.STRING(400),
		allowNull: true
	},
	createdDate: {
		type: DataTypes.DATE,
		allowNull: true
	}
}, {
	tableName: 'CustomerNotificationTokens',
	timestamps: false,
})