var express = require('express')
var router = express.Router()
const { 
  connection,   
  firebaseDatabase 
} = require('../database/database')
const {checkToken, checkTokenCustomer} = require('./helpers')
const INSERT_SUPPLIER_NOTIFICATION_TOKEN = "call insertSupplierNotificationToken(?, ?)" //insertSupplierNotificationToken(token, supplierId)
const INSERT_CUSTOMER_NOTIFICATION_TOKEN = "call insertCustomerNotificationToken(?, ?)" //insertCustomerNotificationToken(token, supplierId)

//Link http://localhost:3000/token/insertSupplierNotificationToken
router.post('/insertSupplierNotificationToken', async (req, res) => {
  const { tokenkey, supplierid } = req.headers
  const checkTokenResult = await checkToken(tokenkey, supplierid)
  if (checkTokenResult == false) {
    res.json({
      result: "failed",
      data: {},
      message: 'Token is invalid',
      time: Date.now()
    })
    return
  }  
  const {notificationToken} = req.body
  connection.query(INSERT_SUPPLIER_NOTIFICATION_TOKEN,
    [notificationToken, supplierid], (error, results) => {
      debugger
      if (error) {
        res.json({
          result: "failed",
          data: {},
          message: error.sqlMessage,
          time: Date.now()
        })
      } else {
        if (results != null) {
          res.json({
            result: "ok",
            count: results.length,
            data: results,
            message: "Insert supplier's notification successfully",
            time: Date.now()
          })
        }
      }
    })
})
//Link http://localhost:3000/token/insertCustomerNotificationToken
router.post('/insertCustomerNotificationToken', async (req, res) => {
  const { tokenkey, customerid } = req.headers
  const checkTokenResult = await checkTokenCustomer(tokenkey, customerid)
debugger
  if (checkTokenResult == false) {
    res.json({
      result: "failed",
      data: {},
      message: 'Token is invalid',
      time: Date.now()
    })
    return
  }  
debugger
  const {notificationToken} = req.body
  connection.query(INSERT_CUSTOMER_NOTIFICATION_TOKEN,
    [notificationToken, customerid], (error, results) => {
      debugger
      if (error) {
        res.json({
          result: "failed",
          data: {},
          message: error.sqlMessage,
          time: Date.now()
        })
      } else {
        if (results != null) {
          res.json({
            result: "ok",
            count: results.length,
            data: results,
            message: "Insert customer's notification successfully",
            time: Date.now()
          })
        }
      }
    })
})
//Link http://localhost:3000/token/tokenCheck
router.post('/tokenCheck', async (req, res) => {  
  const {tokenkey = '', supplierid = ''} = req.headers  
  
  const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))    
  if(checkTokenResult == false) {
    res.json({
      result: "failed", 
      data: {}, 
      message: 'Token is invalid',
      time: Date.now()})      
  } else {
    res.json({
      result: "ok", 
      data: {}, 
      message: 'Token is Good',
      time: Date.now()})      
  }   
})

router.post('/tokenCheckCustomer', async (req, res) => {  
  const {tokenkey = '', customerid = ''} = req.headers    
  const checkTokenResult = await checkTokenCustomer(tokenkey, customerid)    
  if(checkTokenResult == false) {
    res.json({
      result: "failed", 
      data: {}, 
      message: 'Customer token is invalid',
      time: Date.now()})      
  } else {
    res.json({
      result: "ok", 
      data: {}, 
      message: 'Customer token is Good',
      time: Date.now()})      
  }   
})

module.exports = router
