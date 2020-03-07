const mysql = require('mysql')
const { HOSTNAME, DB_PORT, DB_NAME } = require("../constants/constants")
//const FCM_REGISTRATION_TOKEN = "fUV34vmw_k3UumcU3ffkk3:APA91bGYPLlhEV1pIqRozb9oOR3YkQj6bqMsy8__n_3PSNGeUzzjmlfM7l8J74sy8-Ksx5MRz4JfGTaI9EaOAu3HMdFnlLmbskBuap8dozdSXHnkQJzg0sKcwrBfaqBvDSAv35A496o6"
const FCM_REGISTRATION_TOKEN = "fSmrwaegQZarMvltkuQw8w:APA91bEpLrNwSboRP1Dh_6oIOqiOITaEw4DSE1blqcqARQ0381DglRY2vfqW_DuLnsJKRRxthpHBzV6DQ_hXbV-tC_Q3L8zRRy1U34c2Z6Plnpoq2E-S7MMeX4NPGWI9-FVKdBUbZ0sr"
//f-XFAPHJQMm2BpaU_FB4vM:APA91bEetIISax7ofTuLtQF-VzYRxCU7bJvbI4VF4349miH1zFONLZ1iQBXALs6FcUrp5Uh04kkRZwF18A_7JbR4v6P3AyZQ9p4luELr0f9kg5SdmQsK8FaDbhVO46yGuvN8t-pF3vup
var Firebase = require('firebase')
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
    firebaseDatabase,
}

