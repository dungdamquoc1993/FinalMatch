
var admin = require('firebase-admin')
var serviceAccount = require("./serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://finalmatch-9f4fe.firebaseio.com"
});

const sendFirebaseCloudMessage = async ({ title, body, payload, notificationTokens }) => {
  let failedTokens = [];
  try {    
    debugger        
    if (notificationTokens.length == 0) {
      console.log('No notification Tokens to send');
      return []
    }    
    let response = await admin.messaging().sendMulticast({
      data: { title, body },
      tokens: notificationTokens,
    })    
    if (response.failureCount > 0) {
      if (response.successCount == notificationTokens.length) {
        console.log("send all notifications successfully")
      }
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.log('Error : '+resp.error.message)
          failedTokens.push(notificationTokens[idx]);
        }
      })
      console.log('List of tokens that caused failures: ');
      failedTokens.forEach(failedToken => {
        console.log(`{failedToken}\n`)
      })

    }    
    return failedTokens
  } catch (error) {    
    console.log('Cannot send FCM.Error =' + error);
    return failedTokens
  }
}

module.exports = {
    sendFirebaseCloudMessage
}
var running = true
if(running == true) {
  sendFirebaseCloudMessage({
    title: "haha", 
    body: "hshdhs", 
    payload:"dadda", 
    notificationTokens: [
      "f1nQEAIvRYS_5bTGuaPMK6:APA91bH-EKzyKTJWkcxIedwo7UISB22OZqe9_LvTVpyl_lPC8CKiV9nsWuTsIJgMrR2RudfZzPp5axdrx-FaiYyxOYa6DT2rW89oObpxY8nPNi0AKNeUicDdQwqaekUc8jMEfv15ZUGw"
    ]}
  );
}
