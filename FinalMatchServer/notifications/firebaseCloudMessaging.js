
var admin = require('firebase-admin')
var serviceAccount = require("./serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://finalmatch-9f4fe.firebaseio.com"
});

const sendFirebaseCloudMessage = async ({title, body, payload, notificationTokens}) => {      
  try {    
    if(notificationTokens.length == 0) {return}
    debugger
    let response = await admin.messaging().sendMulticast({
      data: {title, body},
      tokens: notificationTokens,
    })
    debugger
    if (response.failureCount > 0) {
      debugger
      if(response.successCount == notificationTokens.length) {
        console.log("send all notifications successfully")
      }
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(notificationTokens[idx]);
        }
      });
      console.log('List of tokens that caused failures: ' + failedTokens);
    }
    debugger
  }catch(error) {
    debugger
    console.log('Cannot send FCM.Error ='+error);
  }  
}

module.exports = {
    sendFirebaseCloudMessage
}