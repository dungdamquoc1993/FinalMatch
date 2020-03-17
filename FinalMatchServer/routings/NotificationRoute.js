var express = require('express')
var router = express.Router()
const {checkToken, convertDateToDayMonthYear, removeNullProperties} = require('./helpers')
const {connection} = require('../database/database')
const GET_NOTIFICATIONS_BY_SUPPLIER_ID = "SELECT * FROM Notification WHERE supplierId = ? ORDER BY createdDate DESC" 
const GET_NOTIFICATIONS_BY_CUSTOMER_ID = "SELECT * FROM Notification WHERE customerId = ? ORDER BY createdDate DESC" 

//Link http://localhost:3000/notifications/getNotificationsBySupplierId
router.get('/getNotificationsBySupplierId', async (req, res) => {
    const { supplierId = '' } = req.query    
    connection.query(GET_NOTIFICATIONS_BY_SUPPLIER_ID,
        [supplierId]
        , (error, results) => {            
            if (error) {
                res.json({
                    result: "failed",
                    data: {},
                    message: error.sqlMessage,
                    time: Date.now()
                })
                return
            }
            res.json({
                result: "ok",
                data: results != null && results.length > 0 ? results : [],
                message: `Get Notifications by supplierId successfully`,
                time: Date.now()
            })
        })
})
//Link http://localhost:3000/notifications/getNotificationsByCustomerId
router.get('/getNotificationsByCustomerId', async (req, res) => {
    const { customerId = '' } = req.query    
    connection.query(GET_NOTIFICATIONS_BY_CUSTOMER_ID,
        [customerId]
        , (error, results) => {
            if (error) {
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
                res.json({
                    result: "ok",
                    data,
                    message: `Get Notifications by customerId successfully`,
                    time: Date.now()
                })
            } else {
                res.json({
                    result: "ok",
                    data: [],
                    message: `Get Notifications by customerId successfully`,
                    time: Date.now()
                })
            }
        })
})
module.exports = router
