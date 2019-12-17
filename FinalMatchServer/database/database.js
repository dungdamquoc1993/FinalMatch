const mysql = require('mysql')
const { HOSTNAME, DB_PORT, DB_NAME } = require("../constants/constants")
const connection = mysql.createConnection({
    host: HOSTNAME,
    user: "root",
    password: "",
    database: DB_NAME,
    port: DB_PORT
})
connection.connect((err) => {
    if (err) throw err;
    console.log('Connect MySQL successfully!')
})
module.exports = {connection}