const LoginRegister = require('./LoginRegister')
const Settings = require('./Settings')
// const Orders = require('./Orders')
async function runAllTests() {
	try {
		await LoginRegister.testCase01()
		await LoginRegister.testCase02()
		await LoginRegister.testCase03()
		await Settings.testCase01()
		// await Orders.testCase01()
	}catch(error) {

	}
}
runAllTests()

