const mysql = require('mysql')
const { HOSTNAME, DB_PORT, DB_NAME } = require("../constants/constants")
import Firebase from 'firebase'
//mysql
const connection = mysql.createConnection({
    host: HOSTNAME,
    user: "root",
    password: "CC=2Yw#j5",
    database: DB_NAME,
    port: DB_PORT,
    encoding: 'utf8',    
    charset: 'utf8mb4'
})
connection.connect((err) => {
    if (err) throw err;
    console.log('Connect MySQL successfully!')
})
//firebase
const firebaseConfig = {
    apiKey: "AIzaSyAxPcy5GgWepVoQs2o2fh78vQEAEoSHJPI",
    authDomain: "finalmatch-9f4fe.firebaseapp.com",
    databaseURL: "https://finalmatch-9f4fe.firebaseio.com",
    projectId: "finalmatch-9f4fe",
    storageBucket: "finalmatch-9f4fe.appspot.com",
    messagingSenderId: "863364553369",
    appId: "1:863364553369:web:bee4768735e64cc97c7608"
}
const firebaseApp = Firebase.initializeApp(firebaseConfig);
const firebaseDatabase = firebaseApp.database();
module.exports = {
    connection, 
    firebaseDatabase
}
