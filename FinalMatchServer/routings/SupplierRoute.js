var express = require('express')
var router = express.Router()

// define the home page route
router.get('/', async (req, res) => {
  //....
  res.json({name: "Hoang", age: 30, time: Date.now()})
})

module.exports = router