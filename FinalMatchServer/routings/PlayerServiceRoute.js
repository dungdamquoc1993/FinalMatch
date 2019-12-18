var express = require('express')
var router = express.Router()
const {checkToken} = require('./helpers')
const {connection} = require('../database/database')

const GET_CHECK_PLAYER_SERVICE_EXIST = "SELECT COUNT(*) AS numberOfPlayerServices FROM PlayerService WHERE supplierId = ?"
const POST_INSERT_PLAYER_SERVICE = "CALL insertPlayerService(?, ?, ?, ?, ?, ?, ?)"                                    
//CALL insertPlayerService("playx", "0010", 1, 12.33, 44.55, "Giap Nhat", 11.1)
// define the home page route
router.get('/', async (req, res) => {
    //....
    res.json({name: "Hoang", age: 30, time: Date.now()})
})

//Link http://localhost:3000/suppliers/checkPlayerServiceExist
router.get('/checkPlayerServiceExist', async (req, res) => {
  debugger
  const { supplierId = '' } = req.query
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
        debugger
        const { numberOfPlayerServices = 0 } = results[0]
        if (numberOfPlayerServices > 0) {
          res.json({
            result: "failed",
            data: {numberOfPlayerServices},
            message: `PlayerService exists supplierId = ${supplierId} exist`,
            time: Date.now()
          })
        } else if (numberOfPlayerServices == 0) {
          res.json({
            result: "ok",
            data: {numberOfPlayerServices: 0},
            message: `PlayerService of supplierId = ${supplierId} does not exist`,
            time: Date.now()
          })
        }        
      } 
    })
})
//Link http://localhost:3000/suppliers/insertPlayerService
//CALL insertPlayerService("playx", "0010", 1, 12.33, 44.55, "Giap Nhat", 11.1)
router.post('/insertPlayerService', async (req, res) => {  
  const {tokenkey, supplierid} = req.headers
  debugger
  const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))
  debugger
  if(checkTokenResult == false) {
    res.json({
      result: "false", 
      data: {}, 
      message: 'Token is invalid',
      time: Date.now()})
      return
  }
  const {playerName = '',
      position = '0000',
      supplierId = 0,
      latitude = '',
      longitude = '',
      address = '',
      radius = 10} = req.body    
  //validate, check token ?  
  connection.query(POST_INSERT_PLAYER_SERVICE, 
        [ playerName,
        position,
        supplierId,
        latitude,
        longitude,
        address,
        radius ]
    , (error, results) => {
          debugger
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
                    message: 'insert PlayerService  successfully',
                    time: Date.now()})
              }                
          }
  })    
})

module.exports = router
