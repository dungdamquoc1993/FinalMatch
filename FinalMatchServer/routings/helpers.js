const {connection} = require('../database/database')
const POST_CHECK_TOKEN = "SELECT checkToken(?, ?) as checkTokenResult"
//SELECT checkToken("'2agr'oog&a'y;bb'b'wp;b", 6)
const checkToken = (tokenKey = '', supplierId = 0) => {    
    //convert callback => Promise = async/await
    return new Promise((resolve, reject) => {
        if(tokenKey == '' || supplierId == 0 || supplierId == '') {            
            resolve(false)
        } 
        connection.query(POST_CHECK_TOKEN, [tokenKey, supplierId], (error, results) => {            
            if (error) {                
                resolve(false)
            } else {                                    
                const {checkTokenResult} = results[0];                                
                if(checkTokenResult == 1) {                    
                    resolve(true)
                } else {                    
                    resolve(false)
                }                
            }
        }) 
    })
}
const convertDateToDayMonthYear = (date) => {
    return {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
    }
}
const removeNullProperties = (jsObject) => {
    let clonedObject = {...jsObject}    
    for (key in clonedObject) {        
        if(!clonedObject[key]) {
            clonedObject[key] = ''
        }
    } 
    return clonedObject
}
module.exports = {
    checkToken,
    convertDateToDayMonthYear,
    removeNullProperties
}