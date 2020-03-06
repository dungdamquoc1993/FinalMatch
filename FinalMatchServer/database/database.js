const mysql = require('mysql')
const { HOSTNAME, DB_PORT, DB_NAME } = require("../constants/constants")
const FCM_REGISTRATION_TOKEN = "fUV34vmw_k3UumcU3ffkk3:APA91bGYPLlhEV1pIqRozb9oOR3YkQj6bqMsy8__n_3PSNGeUzzjmlfM7l8J74sy8-Ksx5MRz4JfGTaI9EaOAu3HMdFnlLmbskBuap8dozdSXHnkQJzg0sKcwrBfaqBvDSAv35A496o6"
var Firebase = require('firebase')
var admin = require('firebase-admin')
var serviceAccount = require("./");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://finalmatch-9f4fe.firebaseio.com"
});

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
const sendFirebaseCloudMessage = async (objectData) => {
    try {
        debugger
        let response = admin.messaging().send({
            data: objectData,
            token: FCM_REGISTRATION_TOKEN
        })
        debugger
    } catch (error) {
        debugger
        console.log('Error sending message:', error)

    }
}
module.exports = {
    connection, 
    firebaseDatabase,
    sendFirebaseCloudMessage
}
