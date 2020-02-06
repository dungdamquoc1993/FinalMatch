var express = require('express')
const https = require('https')
const  request = require("request")
var router = express.Router()
export const GoogleAPIKey = 'AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0'

const urlGetAddressFromLatLong = (latitude, longitude) => {    
    return `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${GoogleAPIKey}`
}
/*
const urlGetLatLongFromAddress = (address) => {    
    return `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GoogleAPIKey}`
}*/
const urlGetLatLongFromAddress = () => {    
    return `https://maps.googleapis.com/maps/api/geocode/json`
}
router.get('/getAddressFromLatLong', async (req, res) => {    
    const { latitude = '', longitude = '' } = req.query
    https.get(urlGetAddressFromLatLong(latitude, longitude), (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            
            res.json({
                result: "ok",
                data: JSON.parse(data),
                message: "Get lat/long successfully",
                time: Date.now()
            })    
        });

    }).on("error", (error) => {
        res.json({
            result: "failed",
            data: {},
            message: `Cannot get address from lat, long: ${error}`,
            time: Date.now()
        })
    });    
})
router.get('/getLatLongFromAddress', async (req, res) => {    
    const { address = '' } = req.query    
    const option = {
        uri: urlGetLatLongFromAddress(),
        qs: {
            address, key: GoogleAPIKey
        }
    }
    request(
        option, (error, data, body) => {
            if(error) {
                res.json({
                    result: "failed",
                    data: {},
                    message: `Cannot get address from lat, long: ${error}`,
                    time: Date.now()
                })
                return
            }
            if(data.error_message && data.error_message.length > 0){
                res.json({
                    result: "failed",
                    data: JSON.parse(data),
                    message: "Get lat/long failed: "+  data.error_message,
                    time: Date.now()
                })    
            } else {
                res.json({
                    result: "ok",
                    data: JSON.parse(data),
                    message: "Get lat/long successfully",
                    time: Date.now()
                })    
            }     
    })    
})

module.exports = router
