const axios = require('axios')
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
        if(result.toUpperCase() == 'ok') {
            print(url, '')
        }
        return true
    } catch (error) {
        debugger
        print(url, error)
        console.error(error);
        return false
    }
}
async function sendGet(url, paramObject) {
    try {
        debugger                
        const response = await axios.get(url, {params: paramObject})        
        const responseObject = response.data
        const { result, data, message, time } = responseObject                
        if(result.toUpperCase() == 'ok') {
            print(url, '')
        }
        return true
    } catch (error) {
        debugger
        print(url, error)
        console.error(error);
        return false
    }
}

function print(name, errorString) {
    if(errorString.length > 0) {
        console.log('\x1b[31m%s\x1b[0m',`test FAILED : ${name}:\n ${errorString}`)
    } else {
        console.log('\x1b[36m%s\x1b[0m',`test PASSED : ${name}`)
    }
}
module.exports = {
    sendGet, sendPost
}









