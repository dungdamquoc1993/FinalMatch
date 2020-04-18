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
        debugger     
        const response = await axios(options)        
        const responseObject = response.data
        const { result, data, message, time } = responseObject                
        debugger
        if(result.toUpperCase() == 'OK') {
            print(url, '')
        } else {
            print(url, message)
        }

        return result.toUpperCase() == 'OK'
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
        if(result.toUpperCase() == 'OK') {
            print(url, '')
        } else {
            print(url, message)
        }
        return result.toUpperCase() == 'OK'
    } catch (error) {
        debugger
        print(url, error)
        console.error(error);
        return false
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
module.exports = {
    sendGet, sendPost
}









