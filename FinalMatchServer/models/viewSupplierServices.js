const { Sequelize, DataTypes, Model } = require('sequelize')
const {sequelize} = require('../database/database')
module.exports = sequelize.define('viewSupplierServices', {
	supplierId: {
		type: DataTypes.INTEGER(11),
		allowNull: false,
		defaultValue: '0'
	},
	name: {
		type: DataTypes.STRING(300),
		allowNull: false,
		defaultValue: ''
	},
	avatar: {
		type: DataTypes.STRING(500),
		allowNull: true,
		defaultValue: ''
	},
	password: {
		type: DataTypes.STRING(400),
		allowNull: false,
		defaultValue: ''
	},
	phoneNumber: {
		type: DataTypes.STRING(300),
		allowNull: true
	},
	dateOfBirth: {
		type: DataTypes.DATEONLY,
		allowNull: true,
		defaultValue: '1990-01-01'
	},
	facebookId: {
		type: DataTypes.STRING(300),
		allowNull: true,
		defaultValue: ''
	},
	email: {
		type: DataTypes.STRING(250),
		allowNull: true
	},
	userType: {
		type: DataTypes.STRING(150),
		allowNull: true,
		defaultValue: 'default'
	},
	point: {
		type: "POINT",
		allowNull: true
	},
	latitude: {
		type: "DOUBLE",
		allowNull: true
	},
	longitude: {
		type: "DOUBLE",
		allowNull: true
	},
	address: {
		type: DataTypes.STRING(500),
		allowNull: true
	},
	radius: {
		type: DataTypes.FLOAT,
		allowNull: true,
		defaultValue: '15'
	},
	isActive: {
		type: DataTypes.INTEGER(11),
		allowNull: true,
		defaultValue: '1'
	},
	tokenKey: {
		type: DataTypes.STRING(500),
		allowNull: true,
		defaultValue: ''
	},
	playerId: {
		type: DataTypes.INTEGER(11),
		allowNull: true,
		defaultValue: '0'
	},
	playerPrice: {
		type: DataTypes.FLOAT,
		allowNull: true
	},
	playerName: {
		type: DataTypes.STRING(300),
		allowNull: true
	},
	position: {
		type: DataTypes.STRING(10),
		allowNull: true
	},
	refereeId: {
		type: DataTypes.INTEGER(11),
		allowNull: true,
		defaultValue: '0'
	},
	refereePrice: {
		type: DataTypes.FLOAT,
		allowNull: true
	},
	refereeName: {
		type: DataTypes.STRING(300),
		allowNull: true
	}
}, {
	tableName: 'viewSupplierServices',
	timestamps: false,
})
