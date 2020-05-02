const { Sequelize, DataTypes, Model } = require('sequelize')
const {sequelize} = require('../database/database')
module.exports = sequelize.define('PlayerService', {
	id: {
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	price: {
		type: DataTypes.FLOAT,
		allowNull: true
	},
	playerName: {
		type: DataTypes.STRING(300),
		allowNull: false
	},
	position: {
		type: DataTypes.STRING(10),
		allowNull: false
	},
	supplierId: {
		type: DataTypes.INTEGER(11),
		allowNull: true,
		unique: true
	}
}, {
	tableName: 'PlayerService',
	timestamps: false,
})