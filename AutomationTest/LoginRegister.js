const {urlLoginSupplier} = require('./urlNames')
const axios = require('axios')
const qs = require('qs')

async function testLoginSupplier({email, password}) {
    try {
        debugger
        let url = await urlLoginSupplier()        
        const options = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: 'en',
            },
            data: qs.stringify({email, password}),
            url,
        }
        debugger
        const response = await axios(options)
        debugger
        const responseObject = response.json()          
        debugger        
    } catch (error) {
        debugger
        console.error(error);
    }
}
async function testCase01() {
    /**
     * Đăng nhập thử 1 email / pass 
     */    
    await testLoginSupplier({ email:'supplier01@gmail.com', password: '123456' })
}

module.exports = {
    testCase01
}
