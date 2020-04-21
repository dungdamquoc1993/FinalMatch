
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
	sendPost
} = require('./Helper')

var data = {}
var url = ""
async function testCase01() {    
	/* Chạy các câu lệnh này trước khi chạy test case:		
	use FinalMatch;
	CALL deleteSuppliers('supplier01@gmail.com');
	CALL deleteCustomers('customer01@gmail.com');
	*/	
	try {
		await sendPost(await urlDeleteSuppliers(),{ emails:'supplier01@gmail.com', key: 'nu nhi tinh' })
		await sendPost(await urlDeleteCustomers(),{ emails:'customer01@gmail.com', key: 'nu nhi tinh' })
		console.log('Running testCase01')
		url = await urlRegisterSupplier()
		data = await sendPost(url,{ email:'supplier01@gmail.com', password: '123456' })
    	// let x = await sendPost(await urlRegisterSupplier(),{ email:'supplier01@gmail.com', password: '123456' })
    	
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

		console.log('Running testCase02')
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

async function testCase03() {    
	try {
		await sendPost(await urlDeleteSuppliers(),{ emails:'supplier03@gmail.com', key: 'nu nhi tinh' })
		await sendPost(await urlDeleteSuppliers(),{ emails:'supplier04@gmail.com', key: 'nu nhi tinh' })
		console.log('Running testCase03, dang ky lien 2 supplier lien tuc')
		url = await urlRegisterSupplier()
		data = await sendPost(url,{ email:'supplier03@gmail.com', password: '123456' })    	
    	assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)

    	url = await urlRegisterSupplier()
    	data = await sendPost(url, { email:'supplier04@gmail.com', password: '123456' })    	
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
