const { Sequelize, DataTypes, Model } = require('sequelize')
const {sequelize} = require('../database/database')
module.exports = sequelize.define('RefereeService', {
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
	refereeName: {
		type: DataTypes.STRING(300),
		allowNull: false
	},
	supplierId: {
		type: DataTypes.INTEGER(11),
		allowNull: true
	}
}, {
	tableName: 'RefereeService',
	timestamps: false,
})