
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
sendFirebaseCloudMessage({title: "haha", 
  body: "hshdhs", 
  payload:"dadda", 
  notificationTokens: ["cVyLtJnnQv2nNC7nZKqoeQ:APA91bG4by3GaIlqTsaz5jBAjzB-suvHXg5X4nBg8rxou9UrWdKCZ0svhRTkWInW0F1822qPg1cjf5t7DL5LAXOimCUz974C9jxMRUjEosIL2f8xTc_sOlGf7tU7nUdl5bNZOXt7tzPW"]})