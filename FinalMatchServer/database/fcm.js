const https = require('https');
var fs = require('fs');
var {google} = require('googleapis');
var PROJECT_ID = 'finalmatch-9f4fe';
var HOST = 'fcm.googleapis.com';
var PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
var MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
var SCOPES = [MESSAGING_SCOPE];

/**
 * Get a valid access token.
 */
// [START retrieve_access_token]
function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = require('./finalmatch-9f4fe-firebase-adminsdk-xsl4q-bab844d519.json');
    debugger
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    debugger
    jwtClient.authorize(function(err, tokens) {
        debugger
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}
// [END retrieve_access_token]

/**
 * Send HTTP request to FCM with given message.
 *
 * @param {JSON} fcmMessage will make up the body of the request.
 */
function sendFcmMessage(fcmMessage) {
  getAccessToken().then(function(accessToken) {
    var options = {
      hostname: HOST,
      path: PATH,
      method: 'POST',
      // [START use_access_token]
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
      // [END use_access_token]
    };

    var request = https.request(options, function(resp) {
      resp.setEncoding('utf8');
      resp.on('data', function(data) {
        console.log('Message sent to Firebase for delivery, response:');
        console.log(data);
        debugger
      });
    });

    request.on('error', function(err) {
      console.log('Unable to send message to Firebase');
      debugger
      console.log(err);
    });

    request.write(JSON.stringify(fcmMessage));
    debugger
    request.end();
  });
}

/**
 * Construct a JSON object that will be used to customize
 * the messages sent to iOS and Android devices.
 */
function buildOverrideMessage() {
  var fcmMessage = buildCommonMessage();
  var apnsOverride = {
    'payload': {
      'aps': {
        'badge': 1
      }
    },
    'headers': {
      'apns-priority': '10'
    }
  };

  var androidOverride = {
    'notification': {
      'click_action': 'android.intent.action.MAIN'
    }
  };

  fcmMessage['message']['android'] = androidOverride;
  fcmMessage['message']['apns'] = apnsOverride;

  return fcmMessage;
}

/**
 * Construct a JSON object that will be used to define the
 * common parts of a notification message that will be sent
 * to any app instance subscribed to the news topic.
 */
function buildCommonMessage() {
  return {
    'message': {
      'topic': 'news',
      'notification': {
        'title': 'FCM Notification',
        'body': 'Notification from FCM'
      }
    }
  };
}
/*
var message = process.argv[2];
if (message && message == 'common-message') {
  var commonMessage = buildCommonMessage();
  console.log('FCM request body for message using common notification object:');
  console.log(JSON.stringify(commonMessage, null, 2));
  sendFcmMessage(buildCommonMessage());
} else if (message && message == 'override-message') {
  var overrideMessage = buildOverrideMessage();
  console.log('FCM request body for override message:');
  console.log(JSON.stringify(overrideMessage, null, 2));
  sendFcmMessage(buildOverrideMessage());
} else {
  console.log('Invalid command. Please use one of the following:\n'
      + 'node index.js common-message\n'
      + 'node index.js override-message');
}
*/
const sendFirebaseCloudMessage = () => {
    //sendFcmMessage(buildCommonMessage());
    sendFcmMessage(buildOverrideMessage());
}
//sendFirebaseCloudMessage()

module.exports = {
    sendFirebaseCloudMessage
}