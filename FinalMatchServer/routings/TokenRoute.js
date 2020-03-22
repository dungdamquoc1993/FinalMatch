var express = require('express')
const {i18n} = require('../locales/i18n')
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
  const { tokenkey, supplierid, locale } = req.headers
  i18n.setLocale(locale)
  const checkTokenResult = await checkToken(tokenkey, supplierid)
  if (checkTokenResult == false) {
    res.json({
      result: "failed",
      data: {},
      message: i18n.__("Token is invalid"),
      time: Date.now()
    })
    return
  }  
  const {notificationToken} = req.body
  connection.query(INSERT_SUPPLIER_NOTIFICATION_TOKEN,
    [notificationToken, supplierid], (error, results) => {
      
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
  i18n.setLocale(locale)
  const checkTokenResult = await checkTokenCustomer(tokenkey, customerid)

  if (checkTokenResult == false) {
    res.json({
      result: "failed",
      data: {},
      message: i18n.__("Token is invalid"),
      time: Date.now()
    })
    return
  }  

  const {notificationToken} = req.body
  connection.query(INSERT_CUSTOMER_NOTIFICATION_TOKEN,
    [notificationToken, customerid], (error, results) => {
      
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
  i18n.setLocale(locale)  
  const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))    
  if(checkTokenResult == false) {
    res.json({
      result: "failed", 
      data: {}, 
      message: i18n.__("Token is invalid"),
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
  i18n.setLocale(locale)
  const checkTokenResult = await checkTokenCustomer(tokenkey, customerid)    
  if(checkTokenResult == false) {
    res.json({
      result: "failed", 
      data: {}, 
      message: "Customer token is invalid",
      time: Date.now()})      
  } else {
    res.json({
      result: "ok", 
      data: {}, 
      message: "Customer token is Good",
      time: Date.now()})      
  }   
})

module.exports = router
