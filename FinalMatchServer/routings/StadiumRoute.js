var express = require('express')
var router = express.Router()
const {checkToken} = require('./helpers')
const {connection} = require('../database/database')

const POST_INSERT_STADIUM = "CALL insertStadium(?, ?, ?, ?, ?, ?, ?)"                                    
const POST_GET_STADIUM_AROUND_POINT = "CALL getStadiumsAroundPoint(?, ?, ?)"
//getStadiumsAroundPoint(latitude FLOAT, longitude FLOAT, radius FLOAT)

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
                  const {stadiumName, supplierId } = results[0][0]
                  res.json({
                    result: "ok", 
                    data: {stadiumName, supplierId }, 
                    message: 'insert Stadium  successfully',
                    time: Date.now()})
              }                
          }
  })    
})
router.post('/getStadiumsAroundPoint', async (req, res) => {  
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
  const { latitude = 0,
          longitude = 0, 
          radius = 5 * 100000
        } = req.body    

  //validate, check token ?  
    connection.query(POST_GET_STADIUM_AROUND_POINT, 
          [ latitude,
            longitude,
            radius]
      , (error, results) => {
            debugger;        
            if(error) {
                res.json({
                  result: "failed", 
                  data: {}, 
                  message: error.sqlMessage,
                  time: Date.now()})
            } else {
                if(results) {
                    // const {stadiumId
                    //       type
                    //       stadiumName
                    //       latitude
                    //       longitude
                    //       address
                    //       phoneNumber
                    //       distance} 
                    res.json({
                      result: "ok", 
                      count: results == null ? 0: results.length,
                      data: results,
                      message: 'Query Stadiums successfully',
                      time: Date.now()})
                }                
            }
    })    
})
module.exports = router
