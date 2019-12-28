var express = require('express')
var router = express.Router()
const {checkToken} = require('./helpers')
const {connection} = require('../database/database')

const POST_INSERT_STADIUM = "CALL insertStadium(?, ?, ?, ?, ?, ?, ?)"                                    

//Link http://localhost:3000/suppliers/insertStadium
router.post('/insertStadium', async (req, res) => {  
  const {tokenkey, supplierid} = req.headers
  
  const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))
  
  if(checkTokenResult == false) {
    res.json({
      result: "false", 
      data: {}, 
      message: 'Token is invalid',
      time: Date.now()})
      return
  }
  const { type = 0 ,
          stadiumName = '',
          latitude = 0,
          longitude = 0,
          address = '',
          phoneNumber = '',
          supplierId = 0} = req.body    

  //validate, check token ?  
  connection.query(POST_INSERT_STADIUM, 
        [ type,
          stadiumName,
          latitude,
          longitude,
          address,
          phoneNumber,
          supplierId]
    , (error, results) => {
          debugger;        
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
                    message: 'insert Stadium  successfully',
                    time: Date.now()})
              }                
          }
  })    
})

module.exports = router
