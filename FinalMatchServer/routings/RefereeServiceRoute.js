var express = require('express')
var router = express.Router()
const {checkToken} = require('./helpers')
const {connection} = require('../database/database')

const GET_CHECK_REFEREE_SERVICE_EXIST = "SELECT COUNT(*) as numberOfRefereeServices FROM RefereeService WHERE supplierId = ?"
const POST_INSERT_REFEREE_SERVICE = "CALL insertRefereeService(?, ?, ?, ?, ?, ?, ?, ?, ?)"
                                    
// define the home page route
router.get('/', async (req, res) => {
    //....
    res.json({name: "Hoang", age: 30, time: Date.now()})
})

//Link http://localhost:3000/suppliers/checkRefereeServiceExist
router.get('/checkRefereeServiceExist', async (req, res) => {
  
  const { supplierId = '' } = req.query
  //validate, check token ?  
  connection.query(GET_CHECK_REFEREE_SERVICE_EXIST,
    [supplierId]
    , (error, results) => {
      if(error) {
        res.json({
          result: "failed",
          data: {},
          message: error.sqlMessage,
          time: Date.now()
        })
        return
      }
      if (results != null && results.length > 0) {
        
        const { numberOfRefereeServices = 0 } = results[0]
        if (numberOfRefereeServices > 0) {
          res.json({
            result: "failed",
            data: {numberOfRefereeServices},
            message: `RefereeService exists supplierId = ${supplierId} exist`,
            time: Date.now()
          })
        } else if (numberOfRefereeServices == 0) {
          res.json({
            result: "ok",
            data: {numberOfRefereeServices: 0},
            message: `RefereeService of supplierId = ${supplierId} does not exist`,
            time: Date.now()
          })
        }        
      } 
    })
})
//Link http://localhost:3000/suppliers/insertRefereeService
router.post('/insertRefereeService', async (req, res) => {  
  const {tokenkey, supplierid} = req.headers  
  
  const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))  
  if(checkTokenResult == false) {
    res.json({
      result: "failed", 
      data: {}, 
      message: 'Token is invalid',
      time: Date.now()})
      return
  }
  
  const {refereeName = '',   
      price = 100000,
      phoneNumber,   
      supplierId = 0,
      dateOfBirth,      
      latitude = '',
      longitude = '',
      address = '',
      
      radius} = req.body    
  
  //validate, check token ?  
  connection.query(POST_INSERT_REFEREE_SERVICE, 
        [ refereeName, 
          price,
          phoneNumber,
          supplierId,
          dateOfBirth,
        latitude,
        longitude,
        address,
        radius ]
    , (error, results) => {
          
          if(error) {
              res.json({
                result: "failed", 
                data: {}, 
                message: error.sqlMessage,
                time: Date.now()})
          } else {
              if(results != null && results.length > 0) {
                  const {refereeName, supplierId } = results[0][0]
                  res.json({
                    result: "ok", 
                    data: {refereeName, supplierId }, 
                    message: 'insert RefereeService  successfully',
                    time: Date.now()})
              }                
          }
  })    
})

module.exports = router
