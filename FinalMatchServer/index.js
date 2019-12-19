/**
 * yarn add express http request express mysql
 */
const { HOSTNAME, PORT} = require('./constants/constants')
const {app} = require('./server')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const SupplierRoute = require('./routings/SupplierRoute')
const PlayerServiceRoute = require('./routings/PlayerServiceRoute')
const RefereeServiceRoute = require('./routings/RefereeServiceRoute')
const GoogleServiceRoute = require('./routings/GoogleServiceRoute')
const TokenRoute = require('./routings/TokenRoute')


app.use('/suppliers', SupplierRoute)
app.use('/playerServices', PlayerServiceRoute)
app.use('/refereeServices', RefereeServiceRoute)
app.use('/token', TokenRoute)
app.use('/googleServiceRoute', GoogleServiceRoute)


app.listen(PORT, () => {
    console.log(`app listen from : ${PORT}`)
})