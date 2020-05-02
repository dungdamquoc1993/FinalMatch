/* jshint indent: 1 */
const { Sequelize, DataTypes, Model } = require('sequelize')
const {sequelize} = require('../database/database')
module.exports = sequelize.define('Chat', {
	id: {
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	orderId: {
		type: DataTypes.INTEGER(11),
		allowNull: true
	},
	sms: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	senderId: {
		type: DataTypes.STRING(400),
		allowNull: true
	},
	createdDate: {
		type: DataTypes.DATE,
		allowNull: true,
		defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
	},
	seen: {
		type: DataTypes.INTEGER(1),
		allowNull: true,
		defaultValue: '0'
	}
}, {
	tableName: 'Chat',
	timestamps: false,
})