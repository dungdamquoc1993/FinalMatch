const { Sequelize, DataTypes, Model } = require('sequelize')
const {sequelize} = require('../database/database')
module.exports = sequelize.define('Stadium', {
	id: {
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	type: {
		type: DataTypes.INTEGER(11),
		allowNull: true,
		defaultValue: '0'
	},
	stadiumName: {
		type: DataTypes.STRING(300),
		allowNull: false
	},
	point: {
		type: "POINT",
		allowNull: true
	},
	address: {
		type: DataTypes.STRING(500),
		allowNull: false,
		unique: true
	},
	phoneNumber: {
		type: DataTypes.STRING(300),
		allowNull: true
	},
	supplierId: {
		type: DataTypes.INTEGER(11),
		allowNull: true
	}
}, {
	tableName: 'Stadium',
	timestamps: false,
})