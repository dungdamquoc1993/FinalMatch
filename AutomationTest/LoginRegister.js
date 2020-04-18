const {urlLoginSupplier} = require('./urlNames')
const {sendGet, sendPost} = require('./Helper')
async function testCase01() {
    let url = await urlLoginSupplier()        
    await sendPost(url,{ email:'supplier01@gmail.com', password: '123456' })
}

module.exports = {
    testCase01
}
