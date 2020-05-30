const {i18n} = require('../locales/i18n')
const {connection} = require('../database/database')
const POST_CHECK_TOKEN = "SELECT checkToken(?, ?) as checkTokenResult"
const POST_CHECK_TOKEN_CUSTOMER = "SELECT checkTokenCustomer(?, ?) as checkTokenCustomerResult"
const SQL_CHECK_FINISHED_AND_EXPIRED_MATCH = "call checkCompletedAndExpiredMatch()"
const GET_NOTIFICATION_TOKENS_CUSTOMER = "SELECT * FROM CustomerNotificationTokens WHERE customerId = ?"
const GET_NOTIFICATION_TOKENS_SUPPLIER = "SELECT * FROM SupplierNotificationTokens WHERE supplierId = ?"

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
const checkTokenCustomer = (tokenKey = '', customerId = '') => {    
    return new Promise((resolve, reject) => {
        if(tokenKey == '' || customerId == '') {            
            resolve(false)
        } 
        connection.query(POST_CHECK_TOKEN_CUSTOMER, [tokenKey, customerId], (error, results) => {            
            if (error) {                
                resolve(false)
            } else {                                    
                const {checkTokenCustomerResult} = results[0];                                
                if(checkTokenCustomerResult == 1) {                    
                    resolve(true)
                } else {                    
                    resolve(false)
                }                
            }
        }) 
    })
}
//Là token của mỗi device, dùng token này để gửi Remote Notification
const getNotificationTokens = ({supplierId = 0, customerId = ''}) => {    
    let notificationTokens = []
    return new Promise((resolve, reject) => {
        if((supplierId == 0 && customerId == '') ||(supplierId != 0 && customerId != '')) {            
            
            resolve(notificationTokens)
        } 
        
        connection.query(
            supplierId == 0 ? GET_NOTIFICATION_TOKENS_CUSTOMER : GET_NOTIFICATION_TOKENS_SUPPLIER, 
            [supplierId == 0 ? customerId : supplierId], (error, results) => {            
            if (error) {                
                
                resolve(notificationTokens)
            } else {    
                                                                
                if(results.length > 0) {
                    
                    results.forEach(tokenObject => {
                        if(tokenObject && tokenObject.token.length > 3)
                        notificationTokens.push(tokenObject.token)
                    })
                }                                                             
                resolve(notificationTokens)                
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
const checkCompletedOrExpiredMatch = () => {
    return new Promise((resolve, reject) => {                
        connection.query(SQL_CHECK_FINISHED_AND_EXPIRED_MATCH, [], (error, results) => {            
            
            if (error) {                
                resolve(false)
            } else {                                    
                resolve(true)  
            }
        }) 
    })    
}

module.exports = {
    checkToken,
    checkTokenCustomer,
    convertDateToDayMonthYear,
    removeNullProperties,
    checkCompletedOrExpiredMatch,
    getNotificationTokens
}
