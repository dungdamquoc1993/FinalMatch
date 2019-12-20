var express = require('express')
var router = express.Router()
const {checkToken} = require('./helpers')
const {connection} = require('../database/database')

const POST_REGISTER_SUPPLIER = "select registerSupplier(?, ?, ?) as tokenKeySupplierId"
const POST_LOGIN_SUPPLIER = "select loginSupplier(?, ?, ?) as tokenKeySupplierId"
const GET_SUPPLIER_PLAYER_SERVICE = "SELECT name, phoneNumber, X(point) as latitude, Y(point) as longitude,"+
                                    "radius, address FROM Supplier WHERE id = ?"
                                    
//CALL insertPlayerService("playx", "0010", 1, 12.33, 44.55, "Giap Nhat", 11.1)
// define the home page route
router.get('/', async (req, res) => {
    //....
    res.json({name: "Hoang", age: 30, time: Date.now()})
})
//Dang ky Supplier
//Link http://localhost:3000/suppliers/register
router.post('/register', async (req, res) => {    
    const {email, password,userType = "default"} = req.body        
    connection.query(POST_REGISTER_SUPPLIER, [email, password,userType], (error, results) => {            
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
                      data: {tokenKeySupplierId: results[0].tokenKeySupplierId}, 
                      message: 'Register user successfully',
                      time: Date.now()})
                }                
            }
    })    
})

//Link http://localhost:3000/suppliers/login
router.post('/login', async (req, res) => {
  const {email, password,userType = "default"} = req.body      
  connection.query(POST_LOGIN_SUPPLIER, [email, password,userType], (error, results) => {
          
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
                    data: {tokenKeySupplierId: results[0].tokenKeySupplierId}, 
                    message: 'Login user successfully',
                    time: Date.now()})
              }                
          }
  })    
})
//Link http://localhost:3000/suppliers/urlGetSupplierById
router.get('/urlGetSupplierById', async (req, res) => {
  
  const { supplierId = '' } = req.query
  //validate, check token ?  
  connection.query(GET_SUPPLIER_PLAYER_SERVICE,
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
        
        const {name, phoneNumber, latitude, longitude, radius, address} = results[0]
          res.json({
            result: "ok",
            data: {name, phoneNumber, latitude, longitude, radius, address},
            message: `Get Supplier successfully`,
            time: Date.now()
          })             
      } else {
        res.json({
              result: "failed",
              data: {},
              message: `Cannot find Supplier with id = ${supplierId}`,
              time: Date.now()
            })
      }
    })
})


module.exports = router
