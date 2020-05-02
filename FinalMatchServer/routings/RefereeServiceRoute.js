var express = require('express')
const {i18n} = require('../locales/i18n')
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
  
  const { supplierId = '', locale } = req.query
  i18n.setLocale(locale)
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
            message: i18n.__("Supplier with id: %s has Referee's Service", `${supplierId}`),
            time: Date.now()
          })
        } else if (numberOfRefereeServices == 0) {
          res.json({
            result: "ok",
            data: {numberOfRefereeServices: 0},
            message: i18n.__("Supplier with id: %s donot have Referee's Service", `${supplierId}`),
            time: Date.now()
          })
        }        
      } 
    })
})
//Link http://localhost:3000/suppliers/insertRefereeService
router.post('/insertRefereeService', async (req, res) => {  
  const {tokenkey, supplierid, locale} = req.headers  
  i18n.setLocale(locale)
  const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))  
  if(checkTokenResult == false) {
    res.json({
      result: "failed", 
      data: {}, 
      message: i18n.__("Token is invalid"),
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
  let params = [ 
      refereeName, 
      isNaN(parseFloat(price)) ? 0.0 : parseFloat(price), 
      phoneNumber,
      supplierId,
      dateOfBirth,
      isNaN(parseFloat(latitude)) ? 0.0 : parseFloat(latitude), 
      isNaN(parseFloat(longitude)) ? 0.0 : parseFloat(longitude), 
      address,
      isNaN(parseFloat(radius)) ? 0.0 : parseFloat(radius), 
      ]
  connection.query(POST_INSERT_REFEREE_SERVICE, 
        params
    , (error, results) => {
          
          if(error) {
              res.json({
                result: "failed", 
                data: {}, 
                message: error.sqlMessage,
                time: Date.now()})
          } else {
              if(results != null && results.length > 0) {                  
                  res.json({
                    result: "ok", 
                    data: results[0][0], 
                    message: i18n.__("Insert Referee Service  successfully"),
                    time: Date.now()})
              }                
          }
  })    
})
//Api nội bộ
router.post('/deleteRefereeService', async (req, res) => {  
  const {tokenkey, supplierid, locale} = req.headers
  i18n.setLocale(locale)
  const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))
  if(checkTokenResult == false) {
    res.json({
      result: "false", 
      data: {}, 
      message: i18n.__("Token is invalid"),
      time: Date.now()})
      return
  }
  const {id} = req.body    
  connection.query("DELETE FROM RefereeService WHERE id = ?", 
      [id]        
      ,(error, results) => {          
        if(error) {
          res.json({
            result: "failed", 
            data: {}, 
            message: error.sqlMessage,
            time: Date.now()})
        } else {
          res.json({
            result: "ok", 
            data: {}, 
            message: i18n.__("Delete Referee Service  successfully"),
            time: Date.now()})              
        }
  })    
})

module.exports = router
