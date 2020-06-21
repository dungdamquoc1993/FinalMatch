var express = require('express')
const {i18n} = require('../locales/i18n')
var router = express.Router()
const { 
  connection,   
  firebaseDatabase 
} = require('../database/database')
const { Op } = require("sequelize")
const ViewChatOrder = require('../models/viewChatOrder')
const Chat = require('../models/Chat')
const {
  checkTokenCustomer,
  getNotificationTokens,
  getNotificationTokensFromCustomer,
  getNotificationTokensFromSupplier,
  checkToken} = require('./helpers')
const{sendFirebaseCloudMessage} = require('../notifications/firebaseCloudMessaging')

const GET_CHAT_HISTORY = `
  SELECT * FROM viewChatOrder WHERE 
    (CONVERT(viewChatOrder.supplierId, CHAR) = CONVERT(?, CHAR) 
    OR CONVERT(viewChatOrder.customerId, CHAR) = CONVERT(?, CHAR))
    AND viewChatOrder.orderId = ?
  ORDER BY viewChatOrder.createdDate;`
const MAKE_CHAT_SEEN = "UPDATE Chat SET Chat.seen = 1 WHERE orderId = ? AND senderId = ?" 
// const INSERT_NEW_CHAT = "CALL insertNewChat(?, ?, ?)"
//Link http://localhost:3000/chat/insertNewChat
router.post('/insertNewChat', async (req, res) => {      
  const { tokenkey, supplierid, customerid, locale } = req.headers      
  i18n.setLocale(locale)    
  if (await checkToken(tokenkey, supplierid) == false &&
    await checkTokenCustomer(tokenkey, customerid) == false) {    
    res.json({
      result: "false",
      data: {},
      message: i18n.__("Token is invalid"),
      time: Date.now()
    })
    return
  }  
  const { sms, senderId} = req.body
  debugger
  try {    
    let orderId = parseInt(req.body.orderId)      
    const newChat = await Chat.create({orderId, sms, senderId});    
    await newChat.save();    
    let foundObject = await ViewChatOrder.findOne({
        attributes: { exclude: ['id'] },
        where: 
        {
            [Op.and]: 
                [
                    {orderId: {[Op.eq]: orderId}},
                    {sms: {[Op.eq]: sms.trim()}},
                    {senderId: {[Op.eq]: senderId}},
                ]
        }
    })    
    if(foundObject == null) {
      res.json({
        result: "failed",
        data: {},
        message: 'Cannot find this chat',
        time: Date.now()
      })
      return
    }
    const { chatId } = foundObject    
    let updates = {}
    let key = `/chats/${chatId}`
    updates[key] = {
      ...JSON.parse(JSON.stringify(foundObject)) || {}
    }    
    await firebaseDatabase.ref(key).remove()
    await firebaseDatabase.ref().update(updates)
    //Update order, báo cho customerid biết
    let notificationTokens = [] 
    debugger
    if(foundObject.senderId == foundObject.supplierId){
      notificationTokens = await getNotificationTokensFromCustomer({customerId: foundObject.customerId})
    } else if(foundObject.senderId == foundObject.customerId) {
      notificationTokens = await getNotificationTokensFromSupplier({supplierId : foundObject.supplierId})
    }
    debugger
    sendFirebaseCloudMessage({
      title: i18n.__("New Message"),
      body: i18n.__("You got new message"),
      payload: foundObject,
      notificationTokens
    })
    res.json({
      result: "ok",      
      data: foundObject,
      message: i18n.__("Insert new message successfully"),
      time: Date.now()
    })    
  } catch(error) {
    
    res.json({
      result: "failed",
      data: {},
      message: error,
      time: Date.now()
    })
  }
});

//Link http://localhost:3000/chat/getChatHistory
router.post('/getChatHistory', async (req, res) => {  
  const { tokenkey, supplierid, customerid, locale } = req.headers
  i18n.setLocale(locale)
  if (await checkToken(tokenkey, supplierid) == false &&
    await checkTokenCustomer(tokenkey, customerid) == false) {    
    res.json({
      result: "false",
      data: {},
      message: i18n.__("Token is invalid"),
      time: Date.now()
    })
    return
  }
  const {customerOrSupplierId, orderId} = req.body   
  debugger
  connection.query(GET_CHAT_HISTORY,
    [customerOrSupplierId, customerOrSupplierId, orderId], (error, results) => {    
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
          count: results != null ? results.length : 0,
          data: results != null ? results : {},
          message: i18n.__("Get chat's history successfully"),
          time: Date.now()
        })
      }
    })
})

//Link http://localhost:3000/chat/makeSeen
router.post('/makeSeen', async (req, res) => {  
  const { tokenkey, supplierid, customerid, locale } = req.headers
  const {orderId, senderId} = req.body
  i18n.setLocale(locale)  
  if (await checkToken(tokenkey, supplierid) == false &&
    await checkTokenCustomer(tokenkey, customerid) == false) {    
    res.json({
      result: "false",
      data: {},
      message: i18n.__("Token is invalid"),
      time: Date.now()
    })
    return
  }  
  connection.query(MAKE_CHAT_SEEN,
    [orderId, senderId], (error, results) => {      
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
          data: {},
          message: i18n.__("Make chat seen successfully"),
          time: Date.now()
        })
      }
    })
})

module.exports = router
