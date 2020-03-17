
var admin = require('firebase-admin')
var serviceAccount = require("./serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://finalmatch-9f4fe.firebaseio.com"
});

const sendFirebaseCloudMessage = async ({title, body, payload, notificationTokens}) => {      
  try {
    debugger
    const failedTokens = [];    
    debugger
    if(notificationTokens.length == 0) {
      console.log('No notification Tokens to send');
      return []
    }     
    let response = await admin.messaging().sendMulticast({
      data: {title, body},
      tokens: notificationTokens,
    })    
    debugger
    if (response.failureCount > 0) {      
      if(response.successCount == notificationTokens.length) {
        console.log("send all notifications successfully")
      }      
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(notificationTokens[idx]);
        }
      })
      console.log('List of tokens that caused failures: ' + failedTokens);
    } 
    debugger
    return failedTokens   
  }catch(error) {    
    console.log('Cannot send FCM.Error ='+error);
    debugger
    return failedTokens
  }  
}

module.exports = {
    sendFirebaseCloudMessage
}