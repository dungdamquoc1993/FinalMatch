var express = require('express')
var router = express.Router()
const {connection} = require('../database/database')
const {checkTokenCustomer} = require('./helpers')

const POST_REGISTER_CUSTOMER = "CALL registerCustomer(?, ?, ?)"
const POST_LOGIN_CUSTOMER = "CALL loginCustomer(?, ?)"
const POST_LOGIN_FACEBOOK_CUSTOMER = "CALL loginFacebookCustomer(?, ?, ?, ?)"
const GET_CUSTOMER_INFORMATION = "SELECT * FROM Customer WHERE customerId = ?"
const POST_UPDATE_CUSTOMER_INFORMATION = "UPDATE Customer SET name = ?, phoneNumber = ? WHERE customerId = ?"
//Dang ky Customer
//Link http://localhost:3000/customers/register
router.post('/register', async (req, res) => {
  const { name, email, password, facebookId, userType = "default", avatar='', phoneNumber='' } = req.body
  connection.query(POST_REGISTER_CUSTOMER, [name, email, password], (error, results) => {
    if (error) {
      res.json({
        result: "failed",
        data: {},
        message: error.sqlMessage,
        time: Date.now()
      })
    } else {
      if (results != null && results[0].length > 0) {
	const {customerId,name,email, tokenKey, userType} =  results[0].length > 0 && results[0][0]
        res.json({
          result: "ok",
          data: {customerId,name,email, tokenKey, userType},
          message: 'Register Customer successfully',
          time: Date.now()
        })
      }
    }
  })
})

//Link http://localhost:3000/customers/login
router.post('/login', async (req, res) => {
  const {email, password} = req.body      
  connection.query(POST_LOGIN_CUSTOMER, [email, password], (error, results) => {          
          if(error) {
              res.json({
                result: "failed", 
                data: {}, 
                message: error.sqlMessage,
                time: Date.now()})
          } else {
              if(results != null && results.length > 0) {
                  const {customerId,name,email, tokenKey, userType} =  results[0].length > 0 && results[0][0]
                  res.json({
                    result: "ok", 
                    data: {customerId,name,email, tokenKey, userType}, 
                    message: 'Login user successfully',
                    time: Date.now()})
              }                
          }
  })    
})

//Link http://localhost:3000/customers/loginFacebook
router.post('/loginFacebook', async (req, res) => {
  const {facebookId, email = '', name, avatar = ''} = req.body      
  connection.query(POST_LOGIN_FACEBOOK_CUSTOMER, [facebookId, email, name, avatar], (error, results) => {
          if(error) {
              res.json({
                result: "failed", 
                data: {}, 
                message: error.sqlMessage,
                time: Date.now()})
          } else {
              if(results != null && results.length > 0) {
                  const {customerId,facebookId, name, tokenKey, userType} =  results[0].length > 0 && results[0][0]
                  res.json({
                    result: "ok", 
                    data: {customerId,facebookId, name, tokenKey, userType}, 
                    message: 'Login facebook customer successfully',
                    time: Date.now()})
              }                
          }
  })    
})

//Link http://localhost:3000/customers/updateCustomerInformation
router.post('/updateCustomerInformation', async (req, res) => {
  //validate, check token ?  
  const { tokenkey, customerid } = req.headers
  const checkTokenResult = await checkTokenCustomer(tokenkey, customerid)
  debugger
  if (checkTokenResult == false) {
    res.json({
      result: "false",
      data: {},
      message: 'TokenCustomer is invalid',
      time: Date.now()
    })
    return
  }
  const { name = '', phoneNumber = '' } = req.body
  connection.query(POST_UPDATE_CUSTOMER_INFORMATION,
    [name, phoneNumber, customerid]
    , (error, results) => {
      debugger
      if (error) {
        res.json({
          result: "failed",
          data: {},
          message: error.sqlMessage,
          time: Date.now()
        })
        return
      } else {

}
      if (results != null && results.length > 0) {
        debugg
        const { email, name, phoneNumber, tokenKey, userType } = results[0]
        res.json({
          result: "ok",
          data: { email, name, phoneNumber, tokenKey, userType },
          message: `Update Customer successfully`,
          time: Date.now()
        })
      } else {
        res.json({
          result: "failed",
          data: {},
          message: `Cannot find Customer with id = ${customerId}`,
          time: Date.now()
        })
      }
    })
})
//Link http://localhost:3000/customers/urlPostUpdateCustomerInformation
router.get('/urlGetCustomerInformation', async (req, res) => {
  const { customerId = '' } = req.query
  //validate, check token ?  
  connection.query(GET_CUSTOMER_INFORMATION,
    [customerId]
    , (error, results) => {
      if (error) {
        res.json({
          result: "failed",
          data: {},
          message: error.sqlMessage,
          time: Date.now()
        })
        return
      }
      if (results != null && results.length > 0) {
        const {customerId, email, name, phoneNumber, tokenKey, userType } = results[0]
        res.json({
          result: "ok",
          data: {customerId, email, name, phoneNumber, tokenKey, userType},
          message: `Get Customer successfully`,
          time: Date.now()
        })
      } else {
        res.json({
          result: "failed",
          data: {},
          message: `Cannot find Customer with id = ${customerId}`,
          time: Date.now()
        })
      }
    })
})

module.exports = router
