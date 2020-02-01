var express = require('express')
var router = express.Router()
const {checkToken, checkTokenCustomer} = require('./helpers')

//Link http://localhost:3000/token/tokenCheck
router.post('/tokenCheck', async (req, res) => {  
  const {tokenkey = '', supplierid = ''} = req.headers  
  
  const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))    
  if(checkTokenResult == false) {
    res.json({
      result: "failed", 
      data: {}, 
      message: 'Token is invalid',
      time: Date.now()})      
  } else {
    res.json({
      result: "ok", 
      data: {}, 
      message: 'Token is Good',
      time: Date.now()})      
  }   
})

router.post('/tokenCheckCustomer', async (req, res) => {  
  const {tokenkey = '', customerid = ''} = req.headers    
  const checkTokenResult = await checkTokenCustomer(tokenkey, customerid)    
  if(checkTokenResult == false) {
    res.json({
      result: "failed", 
      data: {}, 
      message: 'Customer token is invalid',
      time: Date.now()})      
  } else {
    res.json({
      result: "ok", 
      data: {}, 
      message: 'Customer token is Good',
      time: Date.now()})      
  }   
})

module.exports = router
