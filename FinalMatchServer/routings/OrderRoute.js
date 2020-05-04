var express = require('express')
const {i18n} = require('../locales/i18n')
var router = express.Router()
const Orders = require('../models/Orders')
const {
  checkTokenCustomer,
  checkToken,
  checkCompletedOrExpiredMatch,
  getNotificationTokens
} = require('./helpers')
const OrderStatus = {
  PENDING: "pending", 
  ACCEPTED: "accepted", 
  CANCELLED:"cancelled", 
  COMPLETED: "completed", 
  MISSED: "missed"
}
const { 
  connection,   
  firebaseDatabase 
} = require('../database/database')
const{sendFirebaseCloudMessage} = require('../notifications/firebaseCloudMessaging')
const POST_GET_REFEREE_AROUND_ORDER = "CALL getRefereesAroundOrder(?, ?, ?)"
const POST_GET_PLAYER_AROUND_ORDER = "CALL getPlayersAroundOrder(?, ?, ?, ?)"
const POST_CREATE_NEW_ORDER = "CALL createNewOrder(?, ?, ?, ?, ?, ?)"
const POST_UPDATE_ORDER_STATUS = "CALL updateOrderStatus(?, ?)"
const POST_GET_ORDERS_BY_SUPPLIER_ID =
  "SELECT * FROM viewOrdersSupplierCustomer " +
  "WHERE supplierId = ? AND orderStatus in ('missed', 'pending', 'completed', 'accepted', 'cancelled') " +
  "ORDER BY createdDate DESC"
const POST_GET_ORDERS_BY_CUSTOMER_ID =
  "SELECT * FROM viewOrdersSupplierCustomer " +
  "WHERE customerId = ? AND orderStatus in ('completed', 'accepted') " +
  "ORDER BY createdDate DESC"
const INSERT_NOTIFICATION = "INSERT INTO Notification("+
      "supplierId, "+
      "customerId, "+
      "titleEnglish, "+
      "bodyEnglish, "+
      "titleVietnamese, "+
      "bodyVietnamese, "+
      "orderId) "+
      "VALUES(?, ?, ?, ?, ?, ?, ?)"   


//Link http://150.95.113.87:3000/orders/getOrdersBySupplierId
router.post('/getOrdersBySupplierId', async (req, res) => {
  const { tokenkey, supplierid, locale } = req.headers
  i18n.setLocale(locale)
  const checkTokenResult = await checkToken(tokenkey, supplierid)  
  if (checkTokenResult == false) {
    res.json({
      result: "failed",
      data: {},
      message: i18n.__("Token is invalid"),
      time: Date.now()
    })    
    return
  }
  await checkCompletedOrExpiredMatch() //Chuyển trạng thái các order mà datetimeEnd đã qua thời điểm hiện tại => về trạng thái "completed"
  connection.query(POST_GET_ORDERS_BY_SUPPLIER_ID,
    [supplierid], (error, results) => {      
      if (error) {
        res.json({
          result: "failed",
          data: {},
          message: error.sqlMessage,
          time: Date.now()
        })
      } else {
        if (results != null) {
          res.json({
            result: "ok",
            count: results.length,
            data: results,
            message: i18n.__("Get orders successfully"),
            time: Date.now()
          })
        }
      }
    })
})
//Link http://150.95.113.87:3000/orders/getOrdersByCustomerId
router.post('/getOrdersByCustomerId', async (req, res) => {
  const { tokenkey, customerid, locale } = req.headers
  i18n.setLocale(locale)
  if (await checkTokenCustomer(tokenkey, customerid) == false) {
    res.json({
      result: "failed",
      data: {},
      message: i18n.__("Token is invalid"),
      time: Date.now()
    })
    return
  }
  await checkCompletedOrExpiredMatch() //Chuyển trạng thái các order mà datetimeEnd đã qua thời điểm hiện tại => về trạng thái "completed"
  connection.query(POST_GET_ORDERS_BY_CUSTOMER_ID,
    [customerid], (error, results) => {
      
      if (error) {
        res.json({
          result: "failed",
          data: {},
          message: error.sqlMessage,
          time: Date.now()
        })
      } else {
        if (results != null) {
          res.json({
            result: "ok",
            count: results.length,
            data: results,
            message: i18n.__("Get orders successfully"),
            time: Date.now()
          })
        }
      }
    })
})


//Link http://150.95.113.87:3000/orders/getRefereesAroundOrder
router.post('/getRefereesAroundOrder', async (req, res) => {
  const { tokenkey, customerid, locale } = req.headers
  i18n.setLocale(locale)
  const checkTokenResult = await checkTokenCustomer(tokenkey, customerid)
  if (checkTokenResult == false) {
    res.json({
      result: "false",
      data: {},
      message: i18n.__("Token is invalid"),
      time: Date.now()
    })
    return
  }
  const {
    radius = 10,
    latitude = '',
    longitude = '',
  } = req.body
  //validate, check token ?  
  connection.query(POST_GET_REFEREE_AROUND_ORDER,
    [radius, latitude, longitude]
    , (error, results) => {
      
      if (error) {
        res.json({
          result: "failed",
          data: {},
          message: error.sqlMessage,
          time: Date.now()
        })
      } else {
        if (results != null && results.length > 0) {
          res.json({
            result: "ok",
            count: results[0].length,
            data: results[0],
            message: i18n.__("Get referees successfully"),
            time: Date.now()
          })
        }
      }
    })
})
router.post('/getPlayersAroundOrder', async (req, res) => {
  const { tokenkey, customerid, locale } = req.headers
  i18n.setLocale(locale)
  const checkTokenResult = await checkTokenCustomer(tokenkey, customerid)
  if (checkTokenResult == false) {
    res.json({
      result: "false",
      data: {},
      message: i18n.__("Token is invalid"),
      time: Date.now()
    })
    return
  }
  const {
    radius = 10,
    latitude = '',
    longitude = '',
    position = '0', //gia tri: '1', '2', '3', '4'
  } = req.body
  //validate, check token ?  
  connection.query(POST_GET_PLAYER_AROUND_ORDER,
    [radius, latitude, longitude, `${position}`]
    , (error, results) => {
      if (error) {
        res.json({
          result: "failed",
          data: {},
          message: error.sqlMessage,
          time: Date.now()
        })
      } else {
        if (results != null && results.length > 0) {
          res.json({
            result: "ok",
            count: results[0].length,
            data: results[0],
            message: i18n.__("Get players successfully"),
            time: Date.now()
          })
        }
      }
    })
})
//http://150.95.113.87:3000/orders/createNewOrder
router.post('/createNewOrder', async (req, res) => {
  const { tokenkey, customerid, locale } = req.headers
  i18n.setLocale(locale)
  const checkTokenResult = await checkTokenCustomer(tokenkey, customerid)
  if (checkTokenResult == false) {
    res.json({
      result: "false",
      data: {},
      message: i18n.__("Token is invalid"),
      time: Date.now()
    })
    return
  }
  const {
    customerId,
    supplierId,
    latitude,
    longitude,
    typeRole,
  } = req.body
  let dateTimeStart = req.body.dateTimeStart ////VD: Tue, 18 Feb 2020 09:48:32 GMT, lay tu toUTCString(), Phai validate
  dateTimeStart = new Date(dateTimeStart)
  dateTimeStart.setMilliseconds(0)
  dateTimeStart.setSeconds(0)
  if (!dateTimeStart) {
    res.json({
      result: "failed",
      data: {},
      message: i18n.__("Invalid date format. Tue, 18 Feb 2020 09:48:32 GMT"),
      time: Date.now()
    })
    return
  }
  connection.query(POST_CREATE_NEW_ORDER,
    [customerId,
      supplierId,
      latitude,
      longitude,
      typeRole,
      dateTimeStart]
    , async (error, results) => {
      
      if (error) {
        res.json({
          result: "failed",
          data: {},
          message: error.sqlMessage,
          time: Date.now()
        })
      } else {
        if (results != null && results.length > 0) {
          let updates = {}
          let key = `/orders/${customerId}:${supplierId}`
          updates[key] = {
            ...results[0][0] || {}
          }
          await firebaseDatabase.ref(key).remove()   
          await firebaseDatabase.ref().update(updates) 
          //Tạo order mới, báo cho supplierid biết
          let notificationTokens = await getNotificationTokens({supplierId, customerId: ''})          
          const {supplierName, customerName, orderId} = results[0][0]
          const title = "New Order"
          
          const body = i18n.__("%s create a new order", `${customerName}`);
          let failedTokens = await sendFirebaseCloudMessage({title, 
                                    body, 
                                    payload: body,
                                    notificationTokens
                                  })         
          if(failedTokens.length <= notificationTokens.length) {
            //success
            await insertNotification({supplierId, customerId, title, body, orderId})
          }                        
          res.json({
            result: "ok",
            count: results[0].length,
            data: results[0][0],
            message: i18n.__("Insert new Order successfully"),
            time: Date.now()
          })
        }
      }
    })
})
const insertNotification = ({ 
  supplierId, 
  customerId, 
  titleEnglish, 
  bodyEnglish, 
  titleVietnamese, 
  bodyVietnamese, 
  orderId 
}) => {
  return new Promise((resolve, reject) => {    
    connection.query(INSERT_NOTIFICATION,
      [
        supplierId, 
        customerId, 
        titleEnglish, 
        bodyEnglish, 
        titleVietnamese, 
        bodyVietnamese, 
        orderId
      ]
      , async (error, results) => {
        
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
  })
}
// http://150.95.113.87:3000/orders/updateOrderStatus
router.post('/updateOrderStatus', async (req, res) => {
  //Cả customer và supplier đều thay đổi đc order  
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
  const { newStatus, orderId, sender } = req.body
  //validate, check token ?  
  const { PENDING, ACCEPTED,CANCELLED, COMPLETED, MISSED } = OrderStatus
  
  if (![PENDING, ACCEPTED,CANCELLED, COMPLETED, MISSED].includes(status.trim().toLowerCase())) {
    res.json({
      result: "failed",
      data: {},
      message: i18n.__("Status must be: pending, accepted, cancelled, completed, missed"),
      time: Date.now()
    })
    return
  }
  var orders = []
  try {    
    //Nếu gửi từ supplier
    if (sender == 'supplier') {
      orders = await Orders.findAll({
        where: { customerId: customerid }
      });
      if(newStatus == ACCEPTED) {
        let selectedOrders = orders.filter(eachOrder => eachOrder.orderId == orderId && eachOrder.status == PENDING)
        if(selectedOrders.length == 0) {
          res.json({
            result: "ok",
            count: results[0].length,
            data: results[0][0],
            message: "No change",
            time: Date.now()
          });
        }
        let selectedOrder = selectedOrders[0];
        selectedOrder.status = ACCEPTED;
        await selectedOrder.save();
        await Orders.update({ status: MISSED }, {
          where: {
            [Op.and]: [
                        { customerId: customerid }, 
                        { supplierId: {[Op.ne]: supplierid} },
                        { typeRole: selectedOrder.typeRole}
                      ]
          }
        });
        
      }
    } else if (sender == 'customer') {

    } else {

    }
  }catch(error) {

  }
  

  connection.query(POST_UPDATE_ORDER_STATUS,
    [status, orderId]
    , async (error, results) => {
      
      if (error) {
        res.json({
          result: "failed",
          data: {},
          message: error.sqlMessage,
          time: Date.now()
        })
      } else {

        if (results != null && results.length > 0) {          
          if (!results[0][0]) {
            res.json({
              result: "failed",
              count: 0,
              data: {},
              message: i18n.__("Cannot find order with id: %s to update", `${orderId}`),
              time: Date.now()
            })
            return
          }
          const { supplierId, customerId } = results[0][0]
          let updates = {}
          let key = `/orders/${customerId}:${supplierId}`
          updates[key] = {
            ...results[0][0] || {}
          }          
          await firebaseDatabase.ref(key).remove()   
          await firebaseDatabase.ref().update(updates)    
          
          //Update order, báo cho customerid biết
          let notificationTokens = await getNotificationTokens({supplierId: 0, customerId})
          
          const {supplierName, customerName} = results[0][0]                                                      
          let title = i18n.__("Update an order")
          let body = i18n.__("%s update an order", `${supplierName}`)
          
          let failedTokens = await sendFirebaseCloudMessage({title, 
                                    body, 
                                    payload: body,
                                    notificationTokens
                                  })         
          if(failedTokens.length <= notificationTokens.length) {
            //success
            i18n.setLocale("en")  
            titleEnglish = i18n.__("Update an order")
            bodyEnglish = i18n.__("%s update an order", `${supplierName}`)
            i18n.setLocale("vi")  
            titleVietnamese = i18n.__("Update an order")
            bodyVietnamese = i18n.__("%s update an order", `${supplierName}`)
            await insertNotification({
              supplierId, 
              customerId, 
              titleEnglish, 
              bodyEnglish, 
              titleVietnamese, 
              bodyVietnamese, 
              orderId
            })
          }                                  
          res.json({
            result: "ok",
            count: results[0].length,
            data: results[0][0],
            message: i18n.__("Update order status successfully"),
            time: Date.now()
          })
        } else {
          res.json({
            result: "failed",
            count: 0,
            data: {},
            message: i18n.__("Cannot find order with id: %s to update", `${orderId}`),
            time: Date.now()
          })
        }
      }
    })
})


module.exports = router

