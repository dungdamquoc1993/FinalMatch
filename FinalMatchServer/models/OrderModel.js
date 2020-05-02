const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = require('../database/database')
class OrderModel extends Model {}
debugger
OrderModel.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  typeRole: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  point: {
    type: DataTypes.GEOMETRY,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dateTimeStart: {
    type: DataTypes.DATE,    
  },
  dateTimeEnd: {
    type: DataTypes.DATE,    
  }  
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'OrderModel', // We need to choose the model name
    tableName: 'Orders'
})
module.exports = {
  OrderModel
} 




