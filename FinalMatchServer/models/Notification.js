const { Sequelize, DataTypes, Model } = require('sequelize')
const {sequelize} = require('../database/database')
module.exports = sequelize.define('Notification', {
	id: {
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	titleEnglish: {
		type: DataTypes.STRING(300),
		allowNull: true
	},
	bodyEnglish: {
		type: DataTypes.STRING(500),
		allowNull: true
	},
	titleVietnamese: {
		type: DataTypes.STRING(300),
		allowNull: true
	},
	bodyVietnamese: {
		type: DataTypes.STRING(500),
		allowNull: true
	},
	supplierId: {
		type: DataTypes.INTEGER(11),
		allowNull: true
	},
	customerId: {
		type: DataTypes.STRING(400),
		allowNull: true
	},
	orderId: {
		type: DataTypes.INTEGER(11),
		allowNull: true
	},
	createdDate: {
		type: DataTypes.DATE,
		allowNull: true,
		defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
	}
}, {
	tableName: 'Notification'
})