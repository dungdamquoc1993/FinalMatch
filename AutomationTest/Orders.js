const {	
	urlLoginSupplier, 		
	urlLoginCustomer,
	urlRegisterCustomer,
	urlRegisterSupplier,
	urlDeleteSuppliers,
    urlDeleteCustomers,

    urlInsertRefereeService,
	urlInsertPlayerService,	
} = require('./urlNames')
const {
	assert, 	
	sendGet, 
	sendPost,
	print,
} = require('./Helper')

var data = {}
var url = ""

async function testCase01() {    	
	print('Orders.testCase01')
	print('1. Đăng nhập supplier01')
	print('2. Đăng ký 1 RefereeService')
	print('3. Đăng ký 1 PlayerService')
	print('4. Đăng ký thêm 1 PlayerService/RefereeService => ko đăng ký được ')	
	try {
		url = await urlLoginSupplier()
		data = await sendPost(url,{ email:'supplier01@gmail.com', password: '123456' })    	    	
		assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)	

		url = await urlInsertRefereeService()
		data = await sendPost(url,{ x:''})    	    	
		assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)	
		
		url = await urlInsertPlayerService()
		data = await sendPost(url,{ x:''})    	    	
		assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)	

	}catch(error){
		assert(false, url, error)
	}
    
}
module.exports = {
    testCase01,
    testCase02,
    testCase03
}
