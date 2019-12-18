var express = require('express')
var router = express.Router()
const {checkToken} = require('./helpers')

//Link http://localhost:3000/token/tokenCheck
router.post('/tokenCheck', async (req, res) => {  
  const {tokenkey = '', supplierid = ''} = req.headers  
  debugger
  const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))  
  if(checkTokenResult == false) {
    res.json({
      result: "failed", 
      data: {}, 
      message: 'Token is invalid',
      time: Date.now()})
      return
  }   
})

module.exports = router
