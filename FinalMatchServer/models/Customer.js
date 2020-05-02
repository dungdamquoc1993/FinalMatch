const { Sequelize, DataTypes, Model } = require('sequelize')
const {sequelize} = require('../database/database')
module.exports = sequelize.define('Customer', {
	customerId: {
		type: DataTypes.STRING(400),
		allowNull: false,
		primaryKey: true
	},
	avatar: {
		type: DataTypes.STRING(500),
		allowNull: true,
		defaultValue: ''
	},
	name: {
		type: DataTypes.STRING(300),
		allowNull: false
	},
	password: {
		type: DataTypes.STRING(400),
		allowNull: false
	},
	phoneNumber: {
		type: DataTypes.STRING(300),
		allowNull: true,
		defaultValue: ''
	},
	facebookId: {
		type: DataTypes.STRING(300),
		allowNull: true,
		defaultValue: ''
	},
	email: {
		type: DataTypes.STRING(250),
		allowNull: true,
		unique: true
	},
	userType: {
		type: DataTypes.STRING(150),
		allowNull: true,
		defaultValue: 'default'
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
	}
}, {
	tableName: 'Customer',
	timestamps: false,
})