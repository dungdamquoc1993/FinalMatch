var express = require('express')
const https = require('https')
var router = express.Router()
const GoogleAPIKey = 'AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0'

const urlGetAddressFromLatLong = (latitude, longitude) => {    
    return `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${GoogleAPIKey}`
}
const urlGetLatLongFromAddress = (address) => {    
    return `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GoogleAPIKey}`
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
    https.get(urlGetLatLongFromAddress(address), (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            if(data.error_message && data.error_message.length > 0){
		    
}            
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

module.exports = router
