const mysql = require('mysql')
const { HOSTNAME, DB_PORT, DB_NAME } = require("../constants/constants")
//const FCM_REGISTRATION_TOKEN = "fUV34vmw_k3UumcU3ffkk3:APA91bGYPLlhEV1pIqRozb9oOR3YkQj6bqMsy8__n_3PSNGeUzzjmlfM7l8J74sy8-Ksx5MRz4JfGTaI9EaOAu3HMdFnlLmbskBuap8dozdSXHnkQJzg0sKcwrBfaqBvDSAv35A496o6"
const FCM_REGISTRATION_TOKEN = "fSmrwaegQZarMvltkuQw8w:APA91bEpLrNwSboRP1Dh_6oIOqiOITaEw4DSE1blqcqARQ0381DglRY2vfqW_DuLnsJKRRxthpHBzV6DQ_hXbV-tC_Q3L8zRRy1U34c2Z6Plnpoq2E-S7MMeX4NPGWI9-FVKdBUbZ0sr"
//f-XFAPHJQMm2BpaU_FB4vM:APA91bEetIISax7ofTuLtQF-VzYRxCU7bJvbI4VF4349miH1zFONLZ1iQBXALs6FcUrp5Uh04kkRZwF18A_7JbR4v6P3AyZQ9p4luELr0f9kg5SdmQsK8FaDbhVO46yGuvN8t-pF3vup
var Firebase = require('firebase')
var admin = require('firebase-admin')
var serviceAccount = require("./finalmatch-9f4fe-firebase-adminsdk-xsl4q-bab844d519.json");
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
/*
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
*/
const sendFirebaseCloudMessage = async (objectData) => {
    var accessToken = await getAccessToken() //ya29.c.Kl7BB0GNVoOxqTdaO1yHGYWt0-R5_QgtZShluUudptbpDqroNRWEDJVrOTqbOJdAxoVPOKKCTpgcJZF6mUUy88qynmfwCxqsOV1V_YUGd2Ht4iGh3B_mMKqzp3fz43sd
    debugger
    var message = {
        data: {
          score: '850',
          time: '2:45'
        },
        // token: FCM_REGISTRATION_TOKEN
        token: accessToken
      };
    admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      debugger
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      debugger
    })
}

function getAccessToken() {
  var MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
  var SCOPES = [MESSAGING_SCOPE]
  var {google} = require('googleapis');
  return new Promise(function(resolve, reject) {    
    var jwtClient = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

sendFcmMessage2 = () => {
  const registrationTokens = [
    'f-XFAPHJQMm2BpaU_FB4vM:APA91bEetIISax7ofTuLtQF-VzYRxCU7bJvbI4VF4349miH1zFONLZ1iQBXALs6FcUrp5Uh04kkRZwF18A_7JbR4v6P3AyZQ9p4luELr0f9kg5SdmQsK8FaDbhVO46yGuvN8t-pF3vup',
    'fSmrwaegQZarMvltkuQw8w:APA91bEpLrNwSboRP1Dh_6oIOqiOITaEw4DSE1blqcqARQ0381DglRY2vfqW_DuLnsJKRRxthpHBzV6DQ_hXbV-tC_Q3L8zRRy1U34c2Z6Plnpoq2E-S7MMeX4NPGWI9-FVKdBUbZ0sr'        
  ];
  
  const message = {
    data: {score: '850', time: '2:45'},
    tokens: registrationTokens,
  }
  debugger
  admin.messaging().sendMulticast(message)
  .then((response) => {
    debugger
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(registrationTokens[idx]);
        }
      });
      console.log('List of tokens that caused failures: ' + failedTokens);
    }
  }).catch(error => {
    debugger
  })
}


/*
module.exports = {
    connection, 
    firebaseDatabase,
}
*/
sendFcmMessage2()