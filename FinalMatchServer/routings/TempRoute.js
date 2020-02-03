var express = require('express')
var router = express.Router()
const {checkToken} = require('./helpers')
const {connection} = require('../database/database')
const POST_INSERT_HASHKEY = "INSERT INTO Temp(content, createdDate) VALUES(?, ?)"

//Link http://localhost:3000/temp/insertHashKey
router.post('/insertHashKey', async (req, res) => {       
  const {content} = req.body      
    connection.query(POST_INSERT_HASHKEY, [content, new Date()], (error, results) => {
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
                    data: { },
                    message: 'Insert hashkey successfully',
                    time: Date.now()
                })
            }
        }
    })    
})

module.exports = router
