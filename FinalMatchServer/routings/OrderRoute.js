var express = require('express')
const {i18n} = require('../locales/i18n')
var router = express.Router()
const Orders = require('../models/Orders')
const { Op } = require("sequelize")
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
  MISSED: "missed",
  EXPIRED: "expired"
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

const checkNewOrder = async ({
                              customerId, 
                              supplierId, 
                              latitude, 
                              longitude, 
                              typeRole, 
                              dateTimeStart
                              }) => {
  let orders = await Orders.findAll({
    where: {
      [Op.and]: [
        { customerId },
        { point: { [Op.eq]: { type: 'Point', coordinates: [latitude, longitude] } } },
        { supplierId: { [Op.ne]: supplierid } },
        { typeRole: selectedOrder.typeRole },
        { dateTimeStart: selectedOrder.dateTimeStart }
      ]
    }
  });
  

}
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
  const { newStatus, orderId, sender } = req.body  
  i18n.setLocale(locale)    
  /**tam thoi comment, ko xoaaaaaa 
  if(sender == 'supplier') {
    if (await checkToken(tokenkey, supplierid) == false) {
      res.json({
        result: "failed",
        data: {},
        message: "Supplier's token is incorrect",
        time: Date.now()
      })
      return
    }
  } else if(sender == 'customer') {
    if (await checkTokenCustomer(tokenkey, customerid) == false) {
      res.json({
        result: "failed",
        data: {},
        message: "Customer's token is incorrect",
        time: Date.now()
      })
      return
    }    
  } else {
    res.json({
      result: "failed",
      data: {},
      message: "sender must be 'supplier' or 'customer'",
      time: Date.now()
    })
    return
  }
  */
  //validate, check token ?  
  const { PENDING, ACCEPTED,CANCELLED, COMPLETED, MISSED,EXPIRED } = OrderStatus  
  if (![PENDING, ACCEPTED,CANCELLED, COMPLETED, MISSED].includes(newStatus.trim().toLowerCase())) {    
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
    /**
 * c1 - s1 => c1 o1 s1 R 12h 05-05-2021, pending 
 * CALL createNewOrder('c1',111,888,999,'referee','2021-05-05 12:00:00');
 * 
 * c2 - s1 => c2 o11 s1 R 12h 05-05-2021, peding
 * CALL createNewOrder('c2',111,888,999,'referee','2021-05-05 12:00:00');
 * 
 * c3 - s1 => c3 0111 s1 R 12h 06-05-2021, peding
 * CALL createNewOrder('c3',111,888,999,'referee','2021-05-06 12:00:00');
 * 
 * c1 - s2 => c1 o2 s2 P 12h 06-05-2021, peding
 * c2 - s2 => c2 o22 s2 R 12h 06-05-2021, peding
 * 
 * c1 - s3 => c1 o3 s3 R 12h 06-05-2021, peding
 * c2 - s3 => c2 o33 s3 R 12h 06-05-2021, peding
 * 
 * o1 => accept => 
 * if o1.typeRole = o3.typeRole = R => o3 = missed
 * else if o1.typeRole = o3.typeRole = P => o3 = pending 
 * o1 => accept => 
 * if(o1.datetimeStart = o11.datetimeStart) => 011 = missed
 * 
 */
    let selectedOrder;
    let selectedOrders = []
    if (sender == 'supplier') {            
      orders = await Orders.findAll({
        where: { supplierId: supplierid }
      });
      if(newStatus == ACCEPTED) {
        selectedOrders = orders.filter(eachOrder => eachOrder.id == orderId && eachOrder.status == PENDING)
        debugger
        if(selectedOrders == null || selectedOrders.length == 0) {
          res.json({
            result: "ok",
            count: 0,
            data: {},
            message: "No change",
            time: Date.now()
          });
          return
        }
        selectedOrder = selectedOrders[0];
        debugger
        selectedOrder.status = ACCEPTED;
        await selectedOrder.save();
        let dateTimeStartMinus2Hours = new Date(selectedOrder.dateTimeStart.getTime())
        dateTimeStartMinus2Hours.setHours(selectedOrder.dateTimeStart.getHours() - 2)
        await Orders.update({ status: MISSED }, {
          where: 
            {            
              [Op.and]: [
                          { supplierId: {[Op.eq]: supplierid} },
                          { id: {[Op.ne]: orderId} },
                          { status : {[Op.notIn]: [CANCELLED, COMPLETED, EXPIRED, MISSED, ACCEPTED]}}, 
                          {
                            [Op.and]: 
                              [
                                  {
                                    dateTimeStart: 
                                    {
                                      [Op.between]: 
                                        [
                                          dateTimeStartMinus2Hours, 
                                          selectedOrder.dateTimeEnd
                                        ]
                                    }
                                  },
                                  {
                                    typeRole: 'referee'
                                  } 

                              ]
                          }                          
                        ]
            }
        });                                     
      } else if(newStatus == CANCELLED){        
        selectedOrders = orders.filter(
                                    eachOrder => eachOrder.id == orderId && 
                                    [PENDING, ACCEPTED].includes(eachOrder.status))
        debugger                                    
        if(selectedOrders == null || selectedOrders.length == 0) {
          res.json({
            result: "ok",
            count: results[0].length,
            data: results[0][0],
            message: "No change",
            time: Date.now()
          });
          return
        }
        selectedOrder = selectedOrders[0];
        selectedOrder.status = CANCELLED;
        await selectedOrder.save();        
        let dateTimeStartMinus2Hours = new Date(selectedOrder.dateTimeStart.getTime())
        dateTimeStartMinus2Hours.setHours(selectedOrder.dateTimeStart.getHours() - 2)
        
        await Orders.update({ status: PENDING }, {
          where: 
        {            
          [Op.and]: [
                      { supplierId: {[Op.eq]: supplierid} },
                      { id: {[Op.ne]: orderId} },
                      { status : {[Op.in]: [MISSED]}}, 
                      {
                        [Op.and]: 
                          [
                              {
                                dateTimeStart: 
                                {
                                  [Op.between]: 
                                    [
                                      dateTimeStartMinus2Hours, 
                                      selectedOrder.dateTimeEnd
                                    ]
                                }
                              },                              
                          ]
                      }                          
                    ]
        }
       });
               
       debugger
      }      
    } else if (sender == 'customer') {

    } else {
      res.json({
        result: "failed",
        count: 0,
        data: {},
        message: 'sender must be customer or supplier',
        time: Date.now()
      })
      return
    }
    debugger
    let updates = {}
    let key = `/orders/${customerId}:${supplierId}`
    updates[key] = {
      ...selectedOrder || {}
    }
    await firebaseDatabase.ref(key).remove()
    await firebaseDatabase.ref().update(updates)

    //Update order, báo cho customerid biết
    let notificationTokens = await getNotificationTokens({ supplierId: 0, customerId })

    const { supplierName, customerName } = results[0][0]
    let title = i18n.__("Update an order")
    let body = i18n.__("%s update an order", `${supplierName}`)

    let failedTokens = await sendFirebaseCloudMessage({
      title,
      body,
      payload: body,
      notificationTokens
    })
    if (failedTokens.length <= notificationTokens.length) {
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
      res.json({
        result: "ok",
        count: selectedOrders.length,
        data: results[0][0],
        message: i18n.__("Update order status successfully"),
        time: Date.now()
      })
      return
    }
  } catch(error) {
    debugger
    res.json({
      result: "failed",
      count: 0,
      data: {},
      message: i18n.__("Cannot find order with id: %s to update", `${orderId}`),
      time: Date.now()
    })
  }  
})


module.exports = router

