const {
	urlLoginSupplier, 		
	urlLoginCustomer,
	urlRegisterCustomer,
	urlRegisterSupplier,
	urlUpdateSettings,
} = require('./urlNames')
const {
	assert, 	
	sendGet, 
	sendPost
} = require('./Helper')

var data = null
async function testCase01() {    
	try {
		//Test case update setting	
		console.log('Running Settings.testCase01')				
    	url = await urlLoginSupplier()
		data = await sendPost(url,{ email:'supplier01@gmail.com', password: '123456' })		
		assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)
		
		let tokenKey = data.data.tokenKeySupplierId.split(';')[0]
		let supplierId = data.data.tokenKeySupplierId.split(';')[1]		
		//Vừa login xong, vào luôn màn hình setting, sửa tên, sửa ngày sinh, sau đó save luôn
        url = await urlUpdateSettings();
		data = await sendPost(url,{
				name: 'supplier01',
                playerPrice: "",
                refereePrice: "",
                avatar: "",
                dateOfBirth: '1990-01-01',
                phoneNumber: "",
                address:"",
                latitude: "",
                longitude: "",
                radius: 15,
                playerName: "",
                position: "0000",
                refereeName: "",
                tokenKey, supplierId,
		})    	    	        
        assert(data.result 
            && data.result.toUpperCase() == 'OK',            
            url, data.message)     
        url = await urlUpdateSettings();                	
    	data = await sendPost(url,{
				name: 'supplier01',
                playerPrice: "",
                refereePrice: "",
                avatar: "",
                dateOfBirth: '2002-12-25',
                phoneNumber: "112233445",
                address:"",
                latitude: "",
                longitude: "",
                radius: 15,
                playerName: "",
                position: "0001",
                refereeName: "",
                tokenKey, supplierId,
		})    	    	
    	assert(data.result 
            && data.result.toUpperCase() == 'OK'
            && data.data.phoneNumber == '112233445',            
            url, data.message)                  
    	
	}catch(error){		
		print("Exception", error)
	}    
}
module.exports = {
	testCase01
}