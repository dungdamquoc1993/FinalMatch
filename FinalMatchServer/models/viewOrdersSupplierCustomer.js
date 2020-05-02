const { Sequelize, DataTypes, Model } = require('sequelize')
const {sequelize} = require('../database/database')
module.exports = sequelize.define('viewOrdersSupplierCustomer', {
	orderId: {
		type: DataTypes.INTEGER(11),
		allowNull: false,
		defaultValue: '0'
	},
	typeRole: {
		type: DataTypes.ENUM('player','referee'),
		allowNull: false
	},
	orderLatitude: {
		type: "DOUBLE",
		allowNull: true
	},
	orderLongitude: {
		type: "DOUBLE",
		allowNull: true
	},
	orderStatus: {
		type: DataTypes.STRING(120),
		allowNull: true,
		defaultValue: 'pending'
	},
	createdDate: {
		type: DataTypes.DATE,
		allowNull: true
	},
	dateTimeStart: {
		type: DataTypes.DATE,
		allowNull: true
	},
	dateTimeEnd: {
		type: DataTypes.DATE,
		allowNull: true
	},
	supplierId: {
		type: DataTypes.INTEGER(11),
		allowNull: false,
		defaultValue: '0'
	},
	supplierName: {
		type: DataTypes.STRING(300),
		allowNull: false,
		defaultValue: ''
	},
	supplierPhoneNumber: {
		type: DataTypes.STRING(300),
		allowNull: true
	},
	supplierDateOfBirth: {
		type: DataTypes.DATEONLY,
		allowNull: true,
		defaultValue: '1990-01-01'
	},
	supplierEmail: {
		type: DataTypes.STRING(250),
		allowNull: true
	},
	supplierLatitude: {
		type: "DOUBLE",
		allowNull: true
	},
	supplierLongitude: {
		type: "DOUBLE",
		allowNull: true
	},
	supplierAddress: {
		type: DataTypes.STRING(500),
		allowNull: true
	},
	supplierRadius: {
		type: DataTypes.FLOAT,
		allowNull: true,
		defaultValue: '15'
	},
	supplierAvatar: {
		type: DataTypes.STRING(500),
		allowNull: true,
		defaultValue: ''
	},
	playerName: {
		type: DataTypes.STRING(300),
		allowNull: true
	},
	playerPrice: {
		type: DataTypes.FLOAT,
		allowNull: true
	},
	playerPosition: {
		type: DataTypes.STRING(10),
		allowNull: true
	},
	refereeName: {
		type: DataTypes.STRING(300),
		allowNull: true
	},
	refereePrice: {
		type: DataTypes.FLOAT,
		allowNull: true
	},
	customerId: {
		type: DataTypes.STRING(400),
		allowNull: false
	},
	customerAvatar: {
		type: DataTypes.STRING(500),
		allowNull: true,
		defaultValue: ''
	},
	customerName: {
		type: DataTypes.STRING(300),
		allowNull: false
	},
	customerPhoneNumber: {
		type: DataTypes.STRING(300),
		allowNull: true,
		defaultValue: ''
	},
	customerEmail: {
		type: DataTypes.STRING(250),
		allowNull: true
	}
}, {
	tableName: 'viewOrdersSupplierCustomer',
	timestamps: false,
})