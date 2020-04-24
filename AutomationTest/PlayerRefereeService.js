const {	
	urlLoginSupplier, 		
	urlLoginCustomer,
	urlRegisterCustomer,
	urlRegisterSupplier,
	urlDeleteSuppliers,
    urlDeleteCustomers,
    urlUpdateSettings,

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
	try {		
		print('Running PlayerRefereeService.testCase01')
		print('1. Đăng nhập supplier01')
		print('2. Đăng ký 1 RefereeService')
		print('3. Đăng ký 1 PlayerService')
		print('4. Đăng ký thêm 1 PlayerService/RefereeService => ko đăng ký được ')	
		print('5. Đăng nhập supplier01, kiểm tra xem lat, long đã cập nhật chưa')
		
		url = await urlLoginSupplier()
		data = await sendPost(url,{ email:'supplier01@gmail.com', password: '123456' })    	    	
		assert(data.result && 
			data.result.toUpperCase() == 'OK' &&
			data.data &&
			data.data.tokenKeySupplierId &&
			data.data.tokenKeySupplierId.length > 0
			, url, data.message)			
		let tokenKey = data.data.tokenKeySupplierId.split(';')[0]
		let supplierId = data.data.tokenKeySupplierId.split(';')[1]		
		
		url = await urlInsertRefereeService()		
		data = await sendPost(url,{
			refereeName: "supplier01 trọng tài 1", 
			price: "120000",
			phoneNumber: "11223344",
			supplierId,
			tokenKey,
			dateOfBirth: "2002-12-25",
			latitude: 21.0018068,			
			longitude: 105.8508639,
			address: "339 Bạch Mai, Hai Bà Trưng, Hà Nội, Vietnam",
			radius: "12"
		})    	    			
		assert(
			data.result && data.result.toUpperCase() == 'OK' &&
			data.data.refereeName == "supplier01 trọng tài 1" &&			
			data.data.latitude  > 0 &&
			data.data.longitude > 0 &&
			data.data.address == "339 Bạch Mai, Hai Bà Trưng, Hà Nội, Vietnam" &&
			data.data.radius == "12"
			, url, data.message)		

		url = await urlUpdateSettings();                    
        data = await sendPost(url,{
                name: 'supplier01',
                playerPrice: "",
                refereePrice: "299000",
                avatar: "",
                dateOfBirth: '2002-12-25',
                phoneNumber: "112233499",
                address:"82 Hồng Mai, Bạch Mai, Hai Bà Trưng, Hà Nội, Vietnam",
                latitude: "21.00044822692871",
                longitude: "105.85177612304688",
                radius: 15,
                playerName: "",
                position: "0000",
                refereeName: "trọng tài của supplier01",
                tokenKey, supplierId,
        })              
        assert(data.result 
            && data.result.toUpperCase() == 'OK'
            && data.data.phoneNumber == '112233499',            
            url, data.message)                  

        url = await urlInsertPlayerService()		
		data = await sendPost(url,{
			playerName: "player á ",
			price: 30000,
			position: "0110",			
			latitude: 21.00044822692871,
			longitude: 105.85177612304688,
			address: "82 Hồng Mai, Bạch Mai, Hai Bà Trưng, Hà Nội, Vietnam",
			radius: "13",
			tokenKey, 
			supplierId,
		})    	    
		debugger			
		// assert(
		// 	data.result && data.result.toUpperCase() == 'OK' &&
		// 	data.data.refereeName == "supplier01 trọng tài 1" &&			
		// 	data.data.latitude  > 0 &&
		// 	data.data.longitude > 0 &&
		// 	data.data.address == "339 Bạch Mai, Hai Bà Trưng, Hà Nội, Vietnam" &&
		// 	data.data.radius == "12"
		// 	, url, data.message)		

		print('Finish PlayerRefereeService.testCase01')

	}catch(error){
		assert(false, url, error)
	}
    
}
module.exports = {
    testCase01,
    // testCase02,
    // testCase03
}
