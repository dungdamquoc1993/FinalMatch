/**
 * yarn add express http request express mysql express-fileupload
 */
const { HOSTNAME, PORT, MAXMUM_FILE_SIZE} = require('./constants/constants')
const {app} = require('./server')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(fileUpload({
    limits: { fileSize: MAXMUM_FILE_SIZE * 1024 * 1024 },  //Maximum = 50 MB  
}))
const SupplierRoute = require('./routings/SupplierRoute')
const CustomerRoute = require('./routings/CustomerRoute')
const PlayerServiceRoute = require('./routings/PlayerServiceRoute')
const StadiumRoute = require('./routings/StadiumRoute')
const RefereeServiceRoute = require('./routings/RefereeServiceRoute')
const GoogleServiceRoute = require('./routings/GoogleServiceRoute')
const TokenRoute = require('./routings/TokenRoute')
const OrderRoute = require('./routings/OrderRoute')
const TempRoute = require('./routings/TempRoute')
const ChatRoute = require('./routings/ChatRoute')

app.use('/suppliers', SupplierRoute)
app.use('/customers', CustomerRoute)
app.use('/playerServices', PlayerServiceRoute)
app.use('/refereeServices', RefereeServiceRoute)
app.use('/token', TokenRoute)
app.use('/googleServiceRoute', GoogleServiceRoute)
app.use('/stadium', StadiumRoute)
app.use('/orders', OrderRoute)
app.use('/chat', ChatRoute)
app.use('/temp', TempRoute)

//Chạy api test: node index.js port 3001
const port = process.argv[3] == 'undefined' ? PORT : parseInt(process.argv[3])
app.listen(port, () => {
    console.log(`app listen from : ${port}`)
})
