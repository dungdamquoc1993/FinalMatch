const axios = require('axios')
const process = require('process')

async function sendPost(url, paramObject) {
    try {        
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: 'en',
            },
            data: JSON.stringify(paramObject),
            url,
        }           
        const response = await axios(options)        
        const responseObject = response.data
        const { result, data, message, time } = responseObject                        
        if(result.toUpperCase() == 'OK') {
            print(url, '')
            return {testResult: true, data}
        } else {
            print(url, message)
            return {testResult: false, data: null}
        }        
    } catch (error) {        
        print(url, error.message)        
        return {testResult: false, data: null}
    }
}
async function sendGet(url, paramObject) {
    try {
        debugger                
        const response = await axios.get(url, {params: paramObject})        
        const responseObject = response.data
        const { result, data, message, time } = responseObject                
        if(result.toUpperCase() == 'OK') {
            print(url, '')
            return {testResult: true, data}
        } else {
            print(url, message)
            return {testResult: false, data: null}
        }
    } catch (error) {
        print(url, error)        
        return {testResult: false, data: null}
    }
}

function print(name, errorString) {
    debugger
    if(errorString.length > 0) {
        console.log('\x1b[31m%s\x1b[0m',`test FAILED : ${name}. Detail error: ${errorString}`)
    } else {
        console.log('\x1b[36m%s\x1b[0m',`test PASSED : ${name}`)
    }
}
function assert(boolResult) {
    if(boolResult == false) {
        process.exit()
    }
}
module.exports = {
    sendGet, 
    sendPost,
    assert
}









