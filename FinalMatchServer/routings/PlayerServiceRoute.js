var express = require('express')
const {i18n} = require('../locales/i18n')
var router = express.Router()
const {checkToken} = require('./helpers')
const {connection} = require('../database/database')

const GET_CHECK_PLAYER_SERVICE_EXIST = "SELECT COUNT(*) AS numberOfPlayerServices FROM PlayerService WHERE supplierId = ?"
const POST_INSERT_PLAYER_SERVICE = "CALL insertPlayerService(?, ?, ?, ?, ?, ?, ?, ?)"  

//CALL insertPlayerService("playx", "0010", 1, 12.33, 44.55, "Giap Nhat", 11.1)
// define the home page route
router.get('/', async (req, res) => {
    //....
    res.json({name: "Hoang", age: 30, time: Date.now()})
})

//Link http://localhost:3000/suppliers/checkPlayerServiceExist
router.get('/checkPlayerServiceExist', async (req, res) => {  
  const { supplierId = '', locale } = req.query
  i18n.setLocale(locale)
  //validate, check token ?  
  connection.query(GET_CHECK_PLAYER_SERVICE_EXIST,
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
        
        const { numberOfPlayerServices = 0 } = results[0]
        if (numberOfPlayerServices > 0) {
          res.json({
            result: "failed",
            data: {numberOfPlayerServices},
            message: i18n.__("Supplier with id: %s has Player's Service", `${supplierId}`),
            time: Date.now()
          })
        } else if (numberOfPlayerServices == 0) {
          res.json({
            result: "ok",
            data: {numberOfPlayerServices: 0},
            message: i18n.__("Supplier with id: %s donot have Player's Service", `${supplierId}`),
            time: Date.now()
          })
        }        
      } 
    })
})
//Link http://localhost:3000/suppliers/insertPlayerService
//CALL insertPlayerService("playx", "0010", 1, 12.33, 44.55, "Giap Nhat", 11.1)
router.post('/insertPlayerService', async (req, res) => {  
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
  const {playerName = '',
      price = 100000,
      position = '0000',
      supplierId = 0,
      latitude = '',
      longitude = '',
      address = '',
      radius = 10} = req.body  
  //validate, check token ?  
  connection.query(POST_INSERT_PLAYER_SERVICE, 
        [ playerName.normalize(),
          price,
        position,
        supplierId,
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
                  const {playerName, position, supplierId } = results[0][0]
                  res.json({
                    result: "ok", 
                    data: {playerName, position, supplierId }, 
                    message: "insert Player Service  successfully",
                    time: Date.now()})
              }                
          }
  })    
})

module.exports = router
