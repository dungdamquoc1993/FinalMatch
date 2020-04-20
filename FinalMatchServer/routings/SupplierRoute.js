var express = require('express')
const {i18n} = require('../locales/i18n')
var router = express.Router()
const {checkToken, convertDateToDayMonthYear, removeNullProperties} = require('./helpers')
const {connection} = require('../database/database')
const fs = require('fs')//fs = file system
const path = require('path')

const POST_REGISTER_SUPPLIER = "select registerSupplier(?, ?, ?) as tokenKeySupplierId"
const POST_LOGIN_SUPPLIER = "select loginSupplier(?, ?, ?) as tokenKeySupplierId"
const POST_LOGIN_FACEBOOK = "SELECT loginFacebook(?, ?, ?, ?) as tokenKeySupplierId"

const GET_SUPPLIER_PLAYER_SERVICE = "SELECT *, X(point) as latitude, Y(point) as longitude"+
                                    " FROM Supplier WHERE id = ?"
const POST_UPDATE_AVATAR_FOR_SUPPLIER = "UPDATE Supplier SET Supplier.avatar = ? WHERE Supplier.id = ?"    
const GET_SUPPLIER_SERVICES_ORDERS = "SELECT * FROM viewSupplierServicesOrders WHERE supplierId = ?" 
const POST_UPDATE_SETTINGS = "CALL updateSettings(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

// define the home page route
router.get('/', async (req, res) => {
    //....
    res.json({name: "Hoang", age: 30, time: Date.now()})
})
//Dang ky Supplier
//Link http://localhost:3000/suppliers/register
router.post('/register', async (req, res) => {    
    const {email, password,userType = "default"} = req.body   
    i18n.setLocale(req.headers.locale)   
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
                      message: i18n.__("Register user successfully"),
                      time: Date.now()})
                }                
            }
    })    
})

//Link http://localhost:3000/suppliers/login
router.post('/login', async (req, res) => {
  const {email, password,userType = "default"} = req.body    
  debugger 
  i18n.setLocale(req.headers.locale)   
  
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
                    message: i18n.__("Login user successfully"),
                    time: Date.now()})
              }                
          }
  })    
})

//Link http://localhost:3000/suppliers/loginFacebook
router.post('/loginFacebook', async (req, res) => {
  const {facebookId, email = '', name, avatar = ''} = req.body   
  i18n.setLocale(req.headers.locale)   
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
                    message: i18n.__("Login facebook successfully"),
                    time: Date.now()})
              }                
          }
  })    
})

//Link http://localhost:3000/suppliers/urlGetSupplierById
router.get('/urlGetSupplierById', async (req, res) => {
  
  const { supplierId = '', locale } = req.query
  i18n.setLocale(locale)
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
          res.json({
            result: "ok",
            data: results[0],
            message: i18n.__("Get Supplier successfully"),
            time: Date.now()
          })             
      } else {
        res.json({
              result: "failed",
              data: {},
              message: i18n.__("Cannot find Supplier with id: %s",`${supplierId}`),
              time: Date.now()
            })
      }
    })
})
//Link http://localhost:3000/suppliers/uploadAvatar
router.post('/uploadAvatar', async (req, res) => {
  const { tokenkey, supplierid, locale } = req.headers
  i18n.setLocale(locale)
  //Dữ liệu files đc lưu tại : req.files    
  try {
    const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))
    if (checkTokenResult == false) {
      res.json({
        result: "false",
        data: {},
        message: i18n.__("Token is invalid"),
        time: Date.now()
      })
      return
    }
    if (!req.files) {
      res.json({
        result: "failed",
        message: i18n.__("Cannot find files to upload"),
        time: Date.now()
      })
      return
    }
    const keys = Object.keys(req.files)
    if (keys.length === 0) {
      res.json({
        result: "failed",
        message: i18n.__("Cannot find files to upload"),
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
          message: i18n.__("Cannot upload files: %s",`${error}`),
          time: Date.now()
        })
        return
      }
      imageNames.push(`${fileName}.${fileExtension}`)
      //Kiểm tra file cuối cùng trong list ?
      
      if (key === keys[keys.length - 1]) {
        res.json({
          result: "ok",
          message: i18n.__("Upload files successfully"),
          data: imageNames
        })
      }
    })
    //Goi firebase
    //firebaseManager.insertSomething(`${Math.floor(Date.now())}`)

  } catch (error) {
    res.json({
      result: "failed",
      message: i18n.__("Cannot upload files: %s",`${error}`),
    })
  }
})
router.get('/getImage', async (req, res) =>{        
  let {fileName, locale} = req.query   
  i18n.setLocale(locale)
  const destination = `${path.join(__dirname, '..')}/uploads/${fileName}`
  ;
  try {           
      fs.readFile(destination, function(err, data) {
          if (err) {
              res.json({
                  result: 'failed',
                  message: i18n.__("Error getting detail's product:%s",`${err}`),
              })
              return
          }
          res.writeHead(200, {'Content-Type': 'image/jpeg'});
          res.end(data); // Send the file data to the browser.
      });
  } catch(error) {
      res.json({
          result: 'failed',
          message: i18n.__("Error getting detail's product:%s",`${err}`),
      })
  }
})
//Link http://localhost:3000/suppliers/updateAvatarForSupplier
router.post('/updateAvatarForSupplier', async (req, res) => {
  const { tokenkey, supplierid} = req.headers
  i18n.setLocale(req.headers.locale)   
  const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))
  if (checkTokenResult == false) {
    res.json({
      result: "false",
      data: {},
      message: i18n.__("Token is invalid"),
      time: Date.now()
    })
    return
  }
  const { avatar = '' } = req.body
  //validate, check token ?  
  
  connection.query(POST_UPDATE_AVATAR_FOR_SUPPLIER, [avatar, supplierid]
    , (error, results) => {
      
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
          message: i18n.__("Update Avatar for supplier successfully"),
          time: Date.now()
        })
      }
    })
})
//Link http://localhost:3000/suppliers/getSupplierServicesOrders
router.get('/getSupplierServicesOrders', async (req, res) => {  
  const { supplierId = '', locale } = req.query
  i18n.setLocale(locale)
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
                playerPrice,
                refereePrice,
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
          console.log("ddddd = "+JSON.stringify({ 
            name, 
            playerPrice,
            refereePrice,
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
            dateTimeEnd}))
          data.position = position.length > 0 ? position : '0000'
          data.dateOfBirthObject = convertDateToDayMonthYear(dateOfBirth)  
          res.json({
            result: "ok",
            data,
            message: i18n.__("Get SupplierServicesOrders successfully"),
            time: Date.now()
          })             
      } else {
        res.json({
              result: "failed",
              data: {},
              message: i18n.__("Cannot find Supplier with id: %s",`${supplierId}`),
              time: Date.now()
        })
      }
    })
})

//Link http://localhost:3000/suppliers/updateSettings
router.post('/updateSettings', async (req, res) => {  
  const {tokenkey, supplierid, locale} = req.headers  
  i18n.setLocale(locale)
  debugger
  const checkTokenResult = await checkToken(tokenkey, parseInt(supplierid))  
  
  if(checkTokenResult == false) {
    res.json({
      result: "failed", 
      data: {}, 
      message: i18n.__("Token is invalid"),
      time: Date.now()})
      return
  }
  
  const {
    name,
    playerPrice,
    refereePrice,
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

  let params = [ 
          supplierid,          
          typeof playerPrice == 'string' ? 0.0 : playerPrice,
          typeof refereePrice == 'string' ? 0.0 : refereePrice,
          name,
          avatar,
          dateOfBirth,
          phoneNumber.trim().length == 0 ? null : phoneNumber,
          address,
          typeof latitude != 'number' && isNaN(parseFloat(latitude)) ? 0.0 : latitude,
          typeof longitude != 'number' && isNaN(parseFloat(longitude)) ? 0.0 : longitude,
          radius,
          playerName,
          position,
          refereeName]
  debugger
  connection.query(POST_UPDATE_SETTINGS, params
    , (error, results) => {
          
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
                    message: i18n.__("Update settings  successfully"),
                    time: Date.now()})
              }                
          }
  })    
})

module.exports = router
