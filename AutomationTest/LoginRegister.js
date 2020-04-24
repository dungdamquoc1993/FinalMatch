
const {
	urlLoginSupplier, 		
	urlLoginCustomer,
	urlRegisterCustomer,
	urlRegisterSupplier,
	urlDeleteSuppliers,
    urlDeleteCustomers,

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
	try {
		print('LoginRegister.testCase01')
		print('1. Xoá hết các customer/supplier test')
		print('2. Tạo ra 1 customer và 1 supplier')
		await sendPost(await urlDeleteSuppliers(),{ emails:'supplier01@gmail.com', key: 'nu nhi tinh' })
		await sendPost(await urlDeleteCustomers(),{ emails:'customer01@gmail.com', key: 'nu nhi tinh' })
		
		url = await urlRegisterSupplier()
		data = await sendPost(url,{ email:'supplier01@gmail.com', password: '123456' })    	    	
    	assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)

    	url = await urlRegisterCustomer()
    	data = await sendPost(url,{ email:'customer01@gmail.com', password: '123456', name: 'customer01' })    	
    	assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)    	    	
	}catch(error){
		assert(false, url, error)
	}

    
}

async function testCase02() {    
	try {
		print('LoginRegister.testCase02')		
		print('1. Login 1 customer và 1 supplier')
		url = await urlLoginSupplier()
		data = await sendPost(url,{ email:'supplier01@gmail.com', password: '123456' })    	    	
    	assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)

    	url = await urlLoginCustomer()
    	data = await sendPost(url,{ email:'customer01@gmail.com', password: '123456'})
    	assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)    	
	}catch(error){
		assert(false, url, error)
	}    
}

module.exports = {
    testCase01,
    testCase02,
}
