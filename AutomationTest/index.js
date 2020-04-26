const LoginRegister = require('./LoginRegister')
const Settings = require('./Settings')
const PlayerRefereeService = require('./PlayerRefereeService')
const Orders = require('./Orders')
async function runAllTests() {
	try {
		await LoginRegister.testCase01()
		await LoginRegister.testCase02()		
		await Settings.testCase01()
		await PlayerRefereeService.testCase01()
		await Orders.testCase01()
	}catch(error) {

	}
}
runAllTests()

