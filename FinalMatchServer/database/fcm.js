
var admin = require('firebase-admin')
var serviceAccount = require("./finalmatch-9f4fe-firebase-adminsdk-xsl4q-bab844d519.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://finalmatch-9f4fe.firebaseio.com"
});

module.exports = {
    sendFirebaseCloudMessage
}