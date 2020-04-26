
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
		print('-Xoá hết các customer/supplier test')		
		await sendPost(await urlDeleteSuppliers(),{ emails:'supplier01@gmail.com,supplier02@gmail.com', key: 'nu nhi tinh' })		
		await sendPost(await urlDeleteCustomers(),{ emails:'customer01@gmail.com,customer02@gmail.com,customer03@gmail.com', key: 'nu nhi tinh' })		
		

		url = await urlRegisterSupplier()
		data = await sendPost(url,{ email:'supplier01@gmail.com', password: '123456' }) 
    	assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)

    	url = await urlRegisterSupplier()
		data = await sendPost(url,{ email:'supplier02@gmail.com', password: '123456' }) 
    	assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)



    	print('-Đăng ký customer01, customer02, customer03')
    	url = await urlRegisterCustomer()
    	data = await sendPost(url,{ email:'customer01@gmail.com', password: '123456', name: 'customer01' })    	    	
    	assert(data.result && 
			data.result.toUpperCase() == 'OK' &&
			data.data &&
			data.data.customerId.length > 0 &&
			data.data.tokenKey.length > 0 &&
			data.data.name == 'customer01' &&
			data.data.email == 'customer01@gmail.com'			
			, url, data.message)
    	
    	url = await urlRegisterCustomer()
    	data = await sendPost(url,{ email:'customer02@gmail.com', password: '123456', name: 'customer02' })    	    	
    	assert(data.result && 
			data.result.toUpperCase() == 'OK' &&
			data.data &&
			data.data.customerId.length > 0 &&
			data.data.tokenKey.length > 0 &&
			data.data.name == 'customer02' &&
			data.data.email == 'customer02@gmail.com'			
			, url, data.message)
    	
    	url = await urlRegisterCustomer()
    	data = await sendPost(url,{ email:'customer03@gmail.com', password: '123456', name: 'customer03' })    	    	
    	assert(data.result && 
			data.result.toUpperCase() == 'OK' &&
			data.data &&
			data.data.customerId.length > 0 &&
			data.data.tokenKey.length > 0 &&
			data.data.name == 'customer03' &&
			data.data.email == 'customer03@gmail.com'			
			, url, data.message)

   
	}catch(error){
		assert(false, url, error)
	}

    
}

async function testCase02() {    
	try {
		print('LoginRegister.testCase02')				
		print('-Login supplier01, supplier02')
		url = await urlLoginSupplier()
		data = await sendPost(url,{ email:'supplier01@gmail.com', password: '123456' })    	    	
		assert(data.result && 
			data.result.toUpperCase() == 'OK' &&
			data.data &&
			data.data.tokenKeySupplierId.length > 2
			, url, data.message)
    	

    	data = await sendPost(url,{ email:'supplier01@gmail.com', password: '123456' })    	    	
		assert(data.result && 
			data.result.toUpperCase() == 'OK' &&
			data.data &&
			data.data.tokenKeySupplierId.length > 2
			, url, data.message)		

    	print('-Login customer01, customer02, customer03')
    	url = await urlLoginCustomer()
    	data = await sendPost(url,{ email:'customer01@gmail.com', password: '123456'})    	
    	assert(data.result && 
			data.result.toUpperCase() == 'OK' &&
			data.data &&
			data.data.customerId.length > 0 &&
			data.data.tokenKey.length > 0 &&
			data.data.name == 'customer01' &&
			data.data.email == 'customer01@gmail.com'			
			, url, data.message)

    	url = await urlLoginCustomer()
    	data = await sendPost(url,{ email:'customer02@gmail.com', password: '123456'})    	
    	assert(data.result && 
			data.result.toUpperCase() == 'OK' &&
			data.data &&
			data.data.customerId.length > 0 &&
			data.data.tokenKey.length > 0 &&
			data.data.name == 'customer02' &&
			data.data.email == 'customer02@gmail.com'			
			, url, data.message)


    	url = await urlLoginCustomer()
    	data = await sendPost(url,{ email:'customer03@gmail.com', password: '123456'})    	
    	assert(data.result && 
			data.result.toUpperCase() == 'OK' &&
			data.data &&
			data.data.customerId.length > 0 &&
			data.data.tokenKey.length > 0 &&
			data.data.name == 'customer03' &&
			data.data.email == 'customer03@gmail.com'			
			, url, data.message)
    	
	}catch(error){
		assert(false, url, error)
	}    
}

module.exports = {
    testCase01,
    testCase02,
}
