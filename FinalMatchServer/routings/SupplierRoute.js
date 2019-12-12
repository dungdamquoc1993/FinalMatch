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
  //....
  const {email, password, userType='default'} = req
  debugger
  connection.query('SELECT * FROM Supplier', (err, result, fields) => {
    debugger;
    console.log("haha")
  })

  /**
   * 
   * connection.query('SELECT ?? FROM ?? WHERE id = ?', [columns, 'users', userId], function (error, results, fields) {
  if (error) throw error;
  // ...
});

   */
  res.json({name: "Hoang", age: 30, time: Date.now()})
})
module.exports = router