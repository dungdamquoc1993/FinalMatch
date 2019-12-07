/**
 * yarn add express http 
 */
const { HOSTNAME, PORT} = require('./constants/constants')
const {app} = require('./server')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const SupplierRoute = require('./routings/SupplierRoute')

app.use('/suppliers', SupplierRoute)//

app.listen(PORT, () => {
    console.log(`app listen from : ${PORT}`)
})