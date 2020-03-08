
var admin = require('firebase-admin')
var serviceAccount = require("./serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://finalmatch-9f4fe.firebaseio.com"
});

const sendFirebaseCloudMessage = async ({title, body, payload, registrationTokens}) => {      
  try {
    if(registrationTokens.length == 0) {return}
    let response = admin.messaging().sendMulticast({
      data: {title, body, payload},
      tokens: registrationTokens,
    })
    if (response.failureCount > 0) {
      if(response.successCount == registrationTokens.length) {
        console.log("send all notifications successfully")
      }
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(registrationTokens[idx]);
        }
      });
      console.log('List of tokens that caused failures: ' + failedTokens);
    }
  }catch(error) {
    console.log('Cannot send FCM.Error ='+error);
  }  
}

module.exports = {
    sendFirebaseCloudMessage
}