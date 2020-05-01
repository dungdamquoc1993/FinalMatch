const {
	urlLoginCustomer, 			
    urlUpdateCustomerInformation,
} = require('./urlNames')
const {
	assert, 	
	sendGet, 
	sendPost
} = require('./Helper')

var data = null
var url = ""
var tokenKey = ""
var customerId = ""
async function testCase01() {    
	try {
		//Test case update setting	
		console.log('Running Orders.testCase01')		
        console.log('1. Login customer01')      
        
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
        tokenKey = data.data.tokenKey
        customerId = data.data.customerId

        console.log('2. Mở OrderPlayer, bấm "địa điểm thi đấu" => update order Infomation ')              
    	url = await urlUpdateCustomerInformation()        
		data = await sendPost(url,{name: 'customer01', phoneNumber: "", tokenKey, customerId})		        
		assert(data.result && data.result.toUpperCase() == 'OK', url, data.message)	
		              

  //   	console.log('Finished Orders.testCase01')         
	}catch(error){		
        debugger
		print("Exception", error)
	}    
}
module.exports = {
	testCase01
}