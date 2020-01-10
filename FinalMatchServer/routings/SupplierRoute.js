var express = require('express')
var router = express.Router()
const {checkToken, convertDateToDayMonthYear, removeNullProperties} = require('./helpers')
const {connection} = require('../database/database')
const fs = require('fs')//fs = file system
const path = require('path')

const POST_REGISTER_SUPPLIER = "select registerSupplier(?, ?, ?) as tokenKeySupplierId"
const POST_LOGIN_SUPPLIER = "select loginSupplier(?, ?, ?) as tokenKeySupplierId"
const POST_LOGIN_FACEBOOK = "SELECT loginFacebook(?, ?, ?, ?) as tokenKeySupplierId"

const GET_SUPPLIER_PLAYER_SERVICE = "SELECT name, phoneNumber, X(point) as latitude, Y(point) as longitude,"+
                                    "radius, address FROM Supplier WHERE id = ?"
const POST_UPDATE_AVATAR_FOR_SUPPLIER = "UPDATE Supplier SET Supplier.avatar = ? WHERE Supplier.id = ?"    
const GET_SUPPLIER_SERVICES_ORDERS = "SELECT * FROM viewSupplierServicesOrders WHERE supplierId = ?" 
const POST_UPDATE_SETTINGS = "CALL updateSettings(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

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

//Link http://localhost:3000/suppliers/loginFacebook
router.post('/loginFacebook', async (req, res) => {
  const {facebookId, email = '', name, avatar = ''} = req.body      
  connection.query(POST_LOGIN_FACEBOOK, [facebookId, email, name, avatar], (error, results) => {
          
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
                    message: 'Login facebook successfully',
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
//Link http://localhost:3000/suppliers/uploadAvatar
router.post('/uploadAvatar', async (req, res) => {
  const { tokenkey, supplierid } = req.headers
  //Dữ liệu files đc lưu tại : req.files    
  try {
    const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))
    if (checkTokenResult == false) {
      res.json({
        result: "false",
        data: {},
        message: 'Token is invalid',
        time: Date.now()
      })
      return
    }
    if (!req.files) {
      res.json({
        result: "failed",
        message: "Cannot find files to upload",
        time: Date.now()
      })
      return
    }
    const keys = Object.keys(req.files)
    if (keys.length === 0) {
      res.json({
        result: "failed",
        message: "Cannot find files to upload",
        time: Date.now()
      })
      return
    }
    let imageNames = []
    keys.forEach(async (key) => {
      const fileName = `${Math.random().toString(36)}`
      const fileObject = await req.files[key]
      const fileExtension = fileObject.name.split('.').pop()
      const destination = `${path.join(__dirname, '..')}/uploads/${fileName}.${fileExtension}`
      let error = await fileObject.mv(destination) //mv = move 
      if (error) {
        res.json({
          result: "failed",
          message: `Cannot upload files. Error: ${error}`,
          time: Date.now()
        })
        return
      }
      imageNames.push(`${fileName}.${fileExtension}`)
      //Kiểm tra file cuối cùng trong list ?
      debugger
      if (key === keys[keys.length - 1]) {
        res.json({
          result: "ok",
          message: `Upload files successfully`,
          data: imageNames
        })
      }
    })
    //Goi firebase
    //firebaseManager.insertSomething(`${Math.floor(Date.now())}`)

  } catch (error) {
    res.json({
      result: "failed",
      message: `Cannot upload files. Error: ${error}`
    })
  }
})
router.get('/getImage', async (req, res) =>{        
  let {fileName} = req.query   
  const destination = `${path.join(__dirname, '..')}/uploads/${fileName}`
  debugger;
  try {           
      fs.readFile(destination, function(err, data) {
          if (err) {
              res.json({
                  result: 'failed',
                  message: `Ko lấy được thông tin chi tiết Product. Error: ${err}`
              })
              return
          }
          res.writeHead(200, {'Content-Type': 'image/jpeg'});
          res.end(data); // Send the file data to the browser.
      });
  } catch(error) {
      res.json({
          result: 'failed',
          message: `Ko lấy được thông tin chi tiết Product. Error: ${error}`
      })
  }
})
//Link http://localhost:3000/suppliers/updateAvatarForSupplier
router.post('/updateAvatarForSupplier', async (req, res) => {
  
  const { tokenkey, supplierid } = req.headers
  const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))
  if (checkTokenResult == false) {
    res.json({
      result: "false",
      data: {},
      message: 'Token is invalid',
      time: Date.now()
    })
    return
  }
  const { avatar = '' } = req.body
  //validate, check token ?  
  debugger
  connection.query(POST_UPDATE_AVATAR_FOR_SUPPLIER, [avatar, supplierid]
    , (error, results) => {
      debugger
      if (error) {
        res.json({
          result: "failed",
          data: {},
          message: error.sqlMessage,
          time: Date.now()
        })
      } else {        
        res.json({
          result: "ok",
          data: { supplierId: supplierid, avatar },
          message: 'Update Avatar for Supplier successfully',
          time: Date.now()
        })
      }
    })
})
//Link http://localhost:3000/suppliers/getSupplierServicesOrders
router.get('/getSupplierServicesOrders', async (req, res) => {  
  const { supplierId = '' } = req.query
  debugger
  connection.query(GET_SUPPLIER_SERVICES_ORDERS,
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
        let data = removeNullProperties(results[0])        
        const { 
                name, 
                playerId, 
                refereeId,
                avatar,
                point, 
                phoneNumber,
                dateOfBirth,                
                facebookId, 
                email, 
                userType,
                address,
                radius, 
                playerName, 
                position,
                refereeName,
                orderId,
                customerId,
                orderPoint,
                status,
                typeRole,
                dateTimeStart,
                dateTimeEnd} = data
          data.position = position.length > 0 ? position : '0000'
          data.dateOfBirthObject = convertDateToDayMonthYear(dateOfBirth)  
          res.json({
            result: "ok",
            data,
            message: `Get SupplierServicesOrders successfully`,
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

//Link http://localhost:3000/suppliers/updateSettings
router.post('/updateSettings', async (req, res) => {  
  const {tokenkey, supplierid} = req.headers  
  const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))  
  debugger
  if(checkTokenResult == false) {
    res.json({
      result: "failed", 
      data: {}, 
      message: 'Token is invalid',
      time: Date.now()})
      return
  }
  
  const {
    name,
    avatar,
    dateOfBirth,
    phoneNumber,
    address,
    latitude,
    longitude,
    radius,
    playerName,
    position,
    refereeName} = req.body    
  
  //validate, check token ?  
  connection.query(POST_UPDATE_SETTINGS, 
        [ supplierid,
          name,
          avatar,
          dateOfBirth,
          phoneNumber,
          address,
          latitude,
          longitude,
          radius,
          playerName,
          position,
          refereeName]
    , (error, results) => {
          debugger
          if(error) {
              res.json({
                result: "failed", 
                data: {}, 
                message: error.sqlMessage,
                time: Date.now()})
          } else {
              if(results) {                  
                  res.json({
                    result: "ok", 
                    data: {}, 
                    message: 'Update settings  successfully',
                    time: Date.now()})
              }                
          }
  })    
})

module.exports = router
