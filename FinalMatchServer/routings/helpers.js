const {connection} = require('../database/database')
const POST_CHECK_TOKEN = "SELECT checkToken(?, ?) as checkTokenResult"
//SELECT checkToken("'2agr'oog&a'y;bb'b'wp;b", 6)
const checkToken = (tokenKey = '', supplierId = 0) => {
    debugger
    //convert callback => Promise = async/await
    return new Promise((resolve, reject) => {
        if(tokenKey == '' || supplierId == 0 || supplierId == '') {
            resolve(false)
        } 
        connection.query(POST_CHECK_TOKEN, [tokenKey, supplierId], (error, results) => {
            debugger
            if (error) {
                resolve(false)
            } else {    
                debugger        
                const {checkTokenResult} = results[0];
                debugger
                resolve(checkTokenResult ==  1 ? true : false)
            }
        }) 
    })
}

module.exports = {
    checkToken
}