const {
	urlLoginSupplier, 		
	urlLoginCustomer,
	urlRegisterCustomer,
	urlRegisterSupplier,
	urlUpdateSettings,
} = require('./urlNames')
const {
	assert, 
	print,
	sendGet, 
	sendPost
} = require('./Helper')

var data = null
async function testCase01() {    
	try {
		//Test yupdateSetting		
		console.log('Running testCase01')
		data = await sendPost(await urlLoginSupplier(),{ email:'supplier01@gmail.com', password: '123456' })		
		assert(data.data != null, true)
		debugger
		let tokenKey = data.data.tokenKeySupplierId.split(';')[0]
		let supplierId = data.data.tokenKeySupplierId.split(';')[0]		
		debugger
		data = await sendPost(await urlUpdateSettings(),{
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
    	debugger
    	assert(data.data != null, true)    	
    	// debugger
	}catch(error){
		debugger
		print("Exception", error)
	}    
}
module.exports = {
	testCase01
}