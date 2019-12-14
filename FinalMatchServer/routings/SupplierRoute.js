var express = require('express')
var router = express.Router()
const {connection} = require('../database/database')
// define the home page route
router.get('/', async (req, res) => {
    //....
    res.json({name: "Hoang", age: 30, time: Date.now()})
})
//Dang ky Supplier
//Link http://localhost:3000/suppliers/register
router.post('/register', async (req, res) => {
    const {email, password,userType = "default"} = req.body    
    const sqlCommand = "select registerSupplier(?, ?, ?) as tokenKey"
    debugger
    connection.query(sqlCommand, [email, password,userType], (error, results) => {
            debugger
            if(error) {
                res.json({
                  result: "failed", 
                  data: {}, 
                  errorMessage: error.sqlMessage,
                  time: Date.now()})
            } else {
                if(results != null && results.length > 0) {
                    res.json({
                      result: "ok", 
                      data: {tokenKey: results[0].tokenKey}, 
                      errorMessage: 'Register user successfully',
                      time: Date.now()})
                }                
            }
    })    
})

//Link http://localhost:3000/suppliers/login
router.post('/login', async (req, res) => {
  const {email, password,userType = "default"} = req.body    
  const sqlCommand = "select loginSupplier(?, ?, ?) as tokenKey"
  connection.query(sqlCommand, [email, password,userType], (error, results) => {
          debugger
          if(error) {
              res.json({
                result: "failed", 
                data: {}, 
                errorMessage: error.sqlMessage,
                time: Date.now()})
          } else {
              if(results != null && results.length > 0) {
                  res.json({
                    result: "ok", 
                    data: {tokenKey: results[0].tokenKey}, 
                    errorMessage: 'Login user successfully',
                    time: Date.now()})
              }                
          }
  })    
})
module.exports = router