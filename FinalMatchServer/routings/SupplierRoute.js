var express = require('express')
var router = express.Router()

// define the home page route
router.get('/', async (req, res) => {
  //....
  res.json({name: "Hoang", age: 30, time: Date.now()})
})
//Dang ky Supplier
//Link http://localhost:3000/suppliers/register
router.post('/register', async (req, res) => {
  //....
  const {email, password, userType='default'} = req
  
  res.json({name: "Hoang", age: 30, time: Date.now()})
})
module.exports = router