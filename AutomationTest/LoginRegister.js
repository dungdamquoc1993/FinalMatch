
const {
	urlLoginSupplier, 		
	urlLoginCustomer,
	urlRegisterCustomer,
	urlRegisterSupplier
} = require('./urlNames')
const {assert, sendGet, sendPost} = require('./Helper')

var data = null
async function testCase01() {    
	/* Chạy các câu lệnh này trước khi chạy test case:	
	set @x = 'supplier01@gmail.com';
	DELETE FROM Notification WHERE supplierId in (SELECT Supplier.id as supplierId FROM Supplier WHERE email=@x);
	DELETE FROM PlayerService WHERE supplierId in (SELECT Supplier.id as supplierId FROM Supplier WHERE email=@x);
	DELETE FROM RefereeService WHERE supplierId in (SELECT Supplier.id as supplierId FROM Supplier WHERE email=@x);
	DELETE FROM Stadium WHERE supplierId in (SELECT Supplier.id as supplierId FROM Supplier WHERE email=@x);
	DELETE FROM SupplierNotificationTokens WHERE supplierId in (SELECT Supplier.id as supplierId FROM Supplier WHERE email=@x);
	DELETE FROM Orders WHERE supplierId in (SELECT Supplier.id as supplierId FROM Supplier WHERE email=@x);	
	DELETE FROM Chat WHERE senderId in (SELECT CONVERT(Supplier.id, CHAR) FROM Supplier WHERE email=@x);
	DELETE FROM Supplier WHERE email=@x

	set @x = 'customer01@gmail.com';
	DELETE FROM Notification WHERE customerId in (SELECT customerId FROM Customer WHERE email=@x);		
	DELETE FROM CustomerNotificationTokens WHERE customerId in (SELECT customerId FROM Customer WHERE email=@x);	
	DELETE FROM Chat WHERE senderId in (SELECT CONVERT(customerId, CHAR) FROM Customer WHERE email=@x);
	DELETE FROM Orders WHERE customerId in (SELECT customerId FROM Customer WHERE email=@x);		
	DELETE FROM Customer WHERE email=@x

	*/	

    data = await sendPost(await urlRegisterSupplier(),{ email:'supplier01@gmail.com', password: '123456' }).data
    assert.equal(data != null, true)
    data = await sendPost(await urlRegisterCustomer(),{ email:'customer01@gmail.com', password: '123456' }).data
    assert.equal(data != null, true)
    // debugger
}

async function testCase02() {    
    data = await sendPost(await urlLoginSupplier(),{ email:'supplier01@gmail.com', password: '123456' })
    data = await sendPost(await urlLoginSupplier(),{ email:'supplier01@gmail.com', password: '123456' })
    // assert.equal(data != null, true)
    // debugger
}

module.exports = {
    testCase01,
    testCase02
}
