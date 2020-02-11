var express = require('express')
const https = require('https')
const  request = require("request")
var router = express.Router()
const GoogleAPIKey = 'AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0'

const urlGetAddressFromLatLong = (latitude, longitude) => {    
    return `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${GoogleAPIKey}`
}
//https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Thanh Xuan&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0
//https://maps.googleapis.com/maps/api/place/textsearch/json?query=xuan&&key=AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0

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
                message: "Get address successfully",
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
	//qs: query string
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
                    data: {},
                    message: "Get lat/long failed: "+  data.error_message,
                    time: Date.now()
                })    
            } else {                
                res.json({
                    result: "ok",
                    data: JSON.parse(data.body),
                    message: "Get lat/long successfully",
                    time: Date.now()
                })    
            }     
    })    
})
/*
router.get('/getPlacesFromAddress', async (req, res) => {    
    const { address = '' } = req.query    
    const option = {
        uri: urlGetPlacesFromAddress,
	    //qs: query string
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
                    message: `Cannot get Places from address: ${error}`,
                    time: Date.now()
                })
                return
            }
            if(data.error_message && data.error_message.length > 0){
                res.json({
                    result: "failed",
                    data: {},
                    message: "Get Places failed: "+  data.error_message,
                    time: Date.now()
                })    
            } else {                
                let { results } = JSON.parse(data.body)
                let places = results.map(place => {
                    let formattedAddress = place["formatted_address"];
                    let latitude = 0.0
                    let longitude = 0.0
                    if (place.geometry && place.geometry.location) {
                        latitude = place.geometry.lat
                        longitude = place.geometry.lng
                    }
                    let name = place["name"] ? place["name"] : ""
                    let placeId = place["place_id"]
                    return { formattedAddress, latitude, longitude, name, placeId }
                })
                res.json({
                    result: "ok",
                    data: places,                    
                    message: "Get Places successfully",
                    time: Date.now()
                })    
            }     
    })    
})
*/
module.exports = router
