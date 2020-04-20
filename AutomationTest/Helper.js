const axios = require('axios')
const process = require('process')

async function sendPost(url, paramObject) {
    try {    
        let headerObject = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            locale: 'en',            
        }            
        if(paramObject.tokenKey !== undefined) {
            headerObject.tokenKey = paramObject.tokenKey            
        }
        if(paramObject.supplierId !== undefined) {            
            headerObject.supplierId = paramObject.supplierId
        }
        debugger
        const options = {
            method: 'POST',
            headers: headerObject,
            data: JSON.stringify(paramObject),
            url,
        }           
        const response = await axios(options)        
        const responseObject = response.data
        const { result, data, message, time } = responseObject                        
        return { url, result, data, message }            
    } catch (error) {        
        return { url, result, data: null, message: error.message }                
    }
}
async function sendGet(url, paramObject) {
    try {
        const response = await axios.get(url, {params: paramObject})        
        const responseObject = response.data
        const { result, data, message, time } = responseObject                
        
    } catch (error) {
    }
}

function assert(boolResult, name, errorString) {
    if(boolResult == false) {
        console.log('\x1b[31m%s\x1b[0m',`test FAILED : ${name}. Detail error: ${errorString}`)
        process.exit()
    } else {
        console.log('\x1b[36m%s\x1b[0m',`test PASSED : ${name}`)   
    }
}
module.exports = {
    sendGet, 
    sendPost,
    assert,
}









