const { Sequelize, DataTypes, Model } = require('sequelize')
const {sequelize} = require('../database/database')
module.exports = sequelize.define('Supplier', {
	id: {
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING(300),
		allowNull: false,
		defaultValue: ''
	},
	password: {
		type: DataTypes.STRING(400),
		allowNull: false,
		defaultValue: ''
	},
	phoneNumber: {
		type: DataTypes.STRING(300),
		allowNull: true,
		unique: true
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
		allowNull: true,
		unique: true
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
	address: {
		type: DataTypes.STRING(500),
		allowNull: true
	},
	appleId: {
                type: DataTypes.STRING(500),
                allowNull: true,
		defaultValue: ''
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
	avatar: {
		type: DataTypes.STRING(500),
		allowNull: true,
		defaultValue: ''
	}
}, {
	tableName: 'Supplier',
	timestamps: false,
})
