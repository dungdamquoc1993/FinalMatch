const { Sequelize, DataTypes, Model } = require('sequelize')
const {sequelize} = require('../database/database')
module.exports = sequelize.define('SupplierNotificationTokens', {
	token: {
		type: DataTypes.STRING(500),
		allowNull: true
	},
	supplierId: {
		type: DataTypes.INTEGER(11),
		allowNull: true
	},
	createdDate: {
		type: DataTypes.DATE,
		allowNull: true
	}
}, {
	tableName: 'SupplierNotificationTokens',
	timestamps: false,
})