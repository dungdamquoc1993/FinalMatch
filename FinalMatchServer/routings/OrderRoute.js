var express = require('express')
var router = express.Router()
const {checkTokenCustomer} = require('./helpers')
const {connection} = require('../database/database')

const POST_GET_REFEREE_AROUND_ORDER = "CALL getRefereeAroundOrder(?, ?, ?)"
const POST_GET_PLAYER_AROUND_ORDER = "CALL getPlayerAroundOrder(?, ?, ?, ?)"

//Link http://150.95.113.87:3000/orders/getRefereeAroundOrder
router.post('/getRefereeAroundOrder', async (req, res) => {  
    const { tokenkey, customerid } = req.headers
    const checkTokenResult = await checkTokenCustomer(tokenkey, customerid)
    if(checkTokenResult == false) {
      res.json({
        result: "false", 
        data: {}, 
        message: 'Token is invalid',
        time: Date.now()})
        return
    }
    const {
        radius = 10,
        latitude = '',
        longitude = '',        
        } = req.body  
    //validate, check token ?  
    connection.query(POST_GET_REFEREE_AROUND_ORDER, 
          [ radius, latitude, longitude]
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
                    res.json({
                      result: "ok", 
                      data: results[0],
                      message: 'Cannot get referee around Order',
                      time: Date.now()})
                }                
            }
    })    
  })
  router.post('/getPlayerAroundOrder', async (req, res) => {  
    const { tokenkey, customerid } = req.headers
    const checkTokenResult = await checkTokenCustomer(tokenkey, customerid)
    if(checkTokenResult == false) {
      res.json({
        result: "false", 
        data: {}, 
        message: 'Token is invalid',
        time: Date.now()})
        return
    }
    const {
        radius = 10,
        latitude = '',
        longitude = '',           
	position= '',
        } = req.body  
    //validate, check token ?  
    connection.query(POST_GET_PLAYER_AROUND_ORDER, 
          [ radius, latitude, longitude, position]
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
                    res.json({
                      result: "ok", 
                      data: results[0], 
                      message: 'Cannot get player around Order',
                      time: Date.now()})
                }                
            }
    })    
  })

module.exports = router
  
