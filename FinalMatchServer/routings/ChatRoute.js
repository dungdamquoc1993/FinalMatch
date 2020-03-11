var express = require('express')
var router = express.Router()
const { 
  connection,   
  firebaseDatabase 
} = require('../database/database')

const {checkTokenCustomer, checkToken} = require('./helpers')
const GET_CHAT_HISTORY = 
          "SELECT * FROM viewChatOrder "+
          +"WHERE CONVERT(viewChatOrder.supplierId, CHAR) = CONVERT(?, CHAR) "+
          +"OR CONVERT(viewChatOrder.customerId, CHAR) = CONVERT(?, CHAR) "+
          +"ORDER BY viewChatOrder.createdDate"
const MAKE_CHAT_SEEN = "UPDATE Chat SET Chat.seen = true" 
const INSERT_NEW_CHAT = "CALL insertNewChat(orderId, sms, senderId)"
//Link http://localhost:3000/chat/insertNewChat
router.post('/insertNewChat', async (req, res) => {  
  const { tokenkey, supplierid, customerid } = req.headers
  debugger
  if (await checkToken(tokenkey, supplierid) == false &&
    await checkTokenCustomer(tokenkey, customerid) == false) {    
    res.json({
      result: "false",
      data: {},
      message: 'Token is invalid',
      time: Date.now()
    })
    return
  }
  const {orderId, sms, senderId} = req.body
  connection.query(INSERT_NEW_CHAT,
    [orderId, sms, senderId], async (error, results) => {
      debugger
      if (error) {
        res.json({
          result: "failed",
          data: {},
          message: error.sqlMessage,
          time: Date.now()
        })
      } else {
        const { chatId } = results[0][0]
          let updates = {}
          let key = `/chats/${chatId}`
          updates[key] = {
            ...results[0][0] || {}
          }          
          await firebaseDatabase.ref(key).remove()   
          await firebaseDatabase.ref().update(updates)    
          //Update order, báo cho customerid biết
          let notificationTokens = await getNotificationTokens({supplierId, customerId})
          sendFirebaseCloudMessage({title: 'New Message', 
                                    body: "You got new message", 
                                    payload: results[0][0],
                                    notificationTokens
                                  })                                                  
        res.json({
          result: "ok",
          count: result != null ? results.length : 0,
          data: results != null ? results : {},
          message: "Insert new message successfully",
          time: Date.now()
        })
      }
    })
})

//Link http://localhost:3000/chat/getChatHistory
router.post('/getChatHistory', async (req, res) => {  
  const { tokenkey, supplierid, customerid } = req.headers
  debugger
  if (await checkToken(tokenkey, supplierid) == false &&
    await checkTokenCustomer(tokenkey, customerid) == false) {    
    res.json({
      result: "false",
      data: {},
      message: 'Token is invalid',
      time: Date.now()
    })
    return
  }
  const {customerOrSupplierId} = req.body
  connection.query(GET_CHAT_HISTORY,
    [customerOrSupplierId], (error, results) => {
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
          count: result != null ? results.length : 0,
          data: results != null ? results : {},
          message: "Get chat's history successfully",
          time: Date.now()
        })
      }
    })
})

//Link http://localhost:3000/chat/makeSeen
router.post('/makeSeen', async (req, res) => {  
  const { tokenkey, supplierid, customerid } = req.headers
  debugger
  if (await checkToken(tokenkey, supplierid) == false &&
    await checkTokenCustomer(tokenkey, customerid) == false) {    
    res.json({
      result: "false",
      data: {},
      message: 'Token is invalid',
      time: Date.now()
    })
    return
  }  
  connection.query(MAKE_CHAT_SEEN,
    [], (error, results) => {
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
          data: {},
          message: "Make chat seen successfully",
          time: Date.now()
        })
      }
    })
})

module.exports = router
