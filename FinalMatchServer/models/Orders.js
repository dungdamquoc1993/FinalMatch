const { Sequelize, DataTypes, Model } = require('sequelize')
const {sequelize} = require('../database/database')
module.exports = sequelize.define('Orders', {
	id: {
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	typeRole: {
		type: DataTypes.ENUM('player','referee'),
		allowNull: false
	},
	customerId: {
		type: DataTypes.STRING(400),
		allowNull: true
	},
	supplierId: {
		type: DataTypes.INTEGER(11),
		allowNull: true
	},
	point: {
		type: "POINT",
		allowNull: false
	},
	status: {
		type: DataTypes.STRING(120),
		allowNull: true,
		defaultValue: 'pending'
	},
	createdDate: {
		type: DataTypes.DATE,
		allowNull: true,
		defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
	},
	dateTimeStart: {
		type: DataTypes.DATE,
		allowNull: true
	},
	dateTimeEnd: {
		type: DataTypes.DATE,
		allowNull: true
	}
}, {
	tableName: 'Orders',
	timestamps: false,
})