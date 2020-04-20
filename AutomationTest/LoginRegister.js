
const {
	urlLoginSupplier, 		
	urlLoginCustomer,
	urlRegisterCustomer,
	urlRegisterSupplier
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
	//setup()
	use FinalMatch;
	set @x = 'supplier01@gmail.com';
	DELETE FROM Notification WHERE supplierId in (SELECT Supplier.id as supplierId FROM Supplier WHERE email=@x);
	DELETE FROM PlayerService WHERE supplierId in (SELECT Supplier.id as supplierId FROM Supplier WHERE email=@x);
	DELETE FROM RefereeService WHERE supplierId in (SELECT Supplier.id as supplierId FROM Supplier WHERE email=@x);
	DELETE FROM Stadium WHERE supplierId in (SELECT Supplier.id as supplierId FROM Supplier WHERE email=@x);
	DELETE FROM SupplierNotificationTokens WHERE supplierId in (SELECT Supplier.id as supplierId FROM Supplier WHERE email=@x);
	DELETE FROM Orders WHERE supplierId in (SELECT Supplier.id as supplierId FROM Supplier WHERE email=@x);	
	DELETE FROM Chat WHERE senderId in (SELECT CONVERT(Supplier.id, CHAR) FROM Supplier WHERE email=@x);
	DELETE FROM Supplier WHERE email=@x;

	set @x = 'customer01@gmail.com';
	DELETE FROM Notification WHERE customerId in (SELECT customerId FROM Customer WHERE email=@x);		
	DELETE FROM CustomerNotificationTokens WHERE customerId in (SELECT customerId FROM Customer WHERE email=@x);	
	DELETE FROM Chat WHERE senderId in (SELECT CONVERT(customerId, CHAR) FROM Customer WHERE email=@x);
	DELETE FROM Orders WHERE customerId in (SELECT customerId FROM Customer WHERE email=@x);		
	DELETE FROM Customer WHERE email=@x;

	*/	
	try {
		console.log('Running testCase01')
		url = await urlRegisterSupplier()
		data = await sendPost(url,{ email:'supplier01@gmail.com', password: '123456' })
    	// let x = await sendPost(await urlRegisterSupplier(),{ email:'supplier01@gmail.com', password: '123456' })
    	debugger
    	assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)
    	url = await urlRegisterCustomer()
    	data = await sendPost(url,{ email:'customer01@gmail.com', password: '123456', name: 'customer01' })
    	assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)
    	//automation test = client bang terminal + tu fild du lieu
    	//test suite
    	// debugger
	}catch(error){
		assert(false, url, error)
	}

    
}

async function testCase02() {    
	try {

		console.log('Running testCase02')
		url = await urlLoginSupplier()
		data = await sendPost(url,{ email:'supplier01@gmail.com', password: '123456' })    	
    	debugger
    	assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)
    	url = await urlLoginCustomer()
    	data = await sendPost(url,{ email:'customer01@gmail.com', password: '123456'})
    	assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)
    	// debugger
	}catch(error){
		assert(false, url, error)
	}    
}

async function testCase03() {    
	try {

		//DELETE FROM Supplier WHERE email in ('supplier03@gmail.com', 'supplier04@gmail.com');
		console.log('Running testCase03, dang ky lien 2 supplier lien tuc')
		url = await urlRegisterSupplier()
		data = await sendPost(url,{ email:'supplier03@gmail.com', password: '123456' })
    	// let x = await sendPost(await urlRegisterSupplier(),{ email:'supplier01@gmail.com', password: '123456' })
    	debugger
    	assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)
    	data = await sendPost(await urlRegisterSupplier(),{ email:'supplier04@gmail.com', password: '123456' })
    	// let x = await sendPost(await urlRegisterSupplier(),{ email:'supplier01@gmail.com', password: '123456' })
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
