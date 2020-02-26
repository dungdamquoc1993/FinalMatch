var express = require('express')
var router = express.Router()
const {
  checkTokenCustomer,
  checkToken,
  checkCompletedMatch
} = require('./helpers')
const OrderStatus = {
  PENDING: "pending", 
  ACCEPTED: "accepted", 
  CANCELLED:"cancelled", 
  COMPLETED: "completed", 
  MISSED: "missed"
}
const { connection, firebaseDatabase } = require('../database/database')
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

//Link http://150.95.113.87:3000/orders/getOrdersBySupplierId
router.post('/getOrdersBySupplierId', async (req, res) => {
  const { tokenkey, supplierid } = req.headers
  const checkTokenResult = await checkToken(tokenkey, supplierid)
  if (checkTokenResult == false) {
    res.json({
      result: "failed",
      data: {},
      message: 'Token is invalid',
      time: Date.now()
    })
    return
  }
  await checkCompletedMatch() //Chuyển trạng thái các order mà datetimeEnd đã qua thời điểm hiện tại => về trạng thái "completed"
  connection.query(POST_GET_ORDERS_BY_SUPPLIER_ID,
    [supplierid], (error, results) => {
      debugger
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
            message: 'Get orders by supplierId successfully',
            time: Date.now()
          })
        }
      }
    })
})
//Link http://150.95.113.87:3000/orders/getOrdersByCustomerId
router.post('/getOrdersByCustomerId', async (req, res) => {
  const { tokenkey, customerid } = req.headers
  if (await checkTokenCustomer(tokenkey, customerid) == false) {
    res.json({
      result: "failed",
      data: {},
      message: 'Token is invalid',
      time: Date.now()
    })
    return
  }
  await checkCompletedMatch() //Chuyển trạng thái các order mà datetimeEnd đã qua thời điểm hiện tại => về trạng thái "completed"
  connection.query(POST_GET_ORDERS_BY_CUSTOMER_ID,
    [customerid], (error, results) => {
      debugger
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
            message: 'Get orders by customerid successfully',
            time: Date.now()
          })
        }
      }
    })
})


//Link http://150.95.113.87:3000/orders/getRefereesAroundOrder
router.post('/getRefereesAroundOrder', async (req, res) => {
  const { tokenkey, customerid } = req.headers
  const checkTokenResult = await checkTokenCustomer(tokenkey, customerid)
  if (checkTokenResult == false) {
    res.json({
      result: "false",
      data: {},
      message: 'Token is invalid',
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
      debugger
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
            message: 'Get referees around Order successfully',
            time: Date.now()
          })
        }
      }
    })
})
router.post('/getPlayersAroundOrder', async (req, res) => {
  const { tokenkey, customerid } = req.headers
  const checkTokenResult = await checkTokenCustomer(tokenkey, customerid)
  if (checkTokenResult == false) {
    res.json({
      result: "false",
      data: {},
      message: 'Token is invalid',
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
            message: 'Get player around Order successfully',
            time: Date.now()
          })
        }
      }
    })
})
//http://150.95.113.87:3000/orders/createNewOrder
router.post('/createNewOrder', async (req, res) => {
  const { tokenkey, customerid } = req.headers
  const checkTokenResult = await checkTokenCustomer(tokenkey, customerid)
  if (checkTokenResult == false) {
    res.json({
      result: "false",
      data: {},
      message: 'Token is invalid',
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
      message: "Invalid date format. Format must be like this: Tue, 18 Feb 2020 09:48:32 GMT",
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
        if (results != null && results.length > 0) {
          let updates = {}
          updates[`/orders/${customerId}:${supplierId}`] = {
            action: "createNewOrder"
          }
          debugger
          await firebaseDatabase.ref().update(updates)
          debugger
          await firebaseDatabase.ref().update({})
          debugger
          res.json({
            result: "ok",
            count: results[0].length,
            data: results[0][0],
            message: 'Insert new Order successfully',
            time: Date.now()
          })
        }
      }
    })
})
// http://150.95.113.87:3000/orders/updateOrderStatus
router.post('/updateOrderStatus', async (req, res) => {
  //Cả customer và supplier đều thay đổi đc order
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
  const { status, orderId } = req.body
  //validate, check token ?  
  const { PENDING, ACCEPTED,CANCELLED, COMPLETED, MISSED } = OrderStatus
  if (![PENDING, ACCEPTED,CANCELLED, COMPLETED, MISSED].includes(status.trim().toLowerCase())) {
    res.json({
      result: "failed",
      data: {},
      message: "Status must be: pending, accepted, cancelled, completed, missed",
      time: Date.now()
    })
    return
  }
  connection.query(POST_UPDATE_ORDER_STATUS,
    [status, orderId]
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
          if (!results[0][0]) {
            res.json({
              result: "failed",
              count: 0,
              data: {},
              message: 'Cannot find data to update',
              time: Date.now()
            })
            return
          }
          const { supplierId, customerId } = results[0][0]
          let updates = {}
          updates[`/orders/${customerId}:${supplierId}`] = {
            action: "updateOrderStatus"
          }
          debugger
          firebaseDatabase.ref().update(updates, (error) => {
            debugger
            firebaseDatabase.ref().update({})
          })
          res.json({
            result: "ok",
            count: results[0].length,
            data: results[0][0],
            message: 'Update order status successfully',
            time: Date.now()
          })
        } else {
          res.json({
            result: "failed",
            count: 0,
            data: {},
            message: 'Cannot find data to update',
            time: Date.now()
          })
        }
      }
    })
})


module.exports = router

