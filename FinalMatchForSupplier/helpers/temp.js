
//import PushNotification from "react-native-push-notification"
import {isIOS} from './Helpers'
// var PushNotification = require("react-native-push-notification")
// import NotificationActions from 'react-native-ios-notification-actions'
import PushNotificationAndroid from 'react-native-push-notification'
PushNotificationAndroid.registerNotificationActions(['Accept','Reject','Yes','No']);

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
    console.log("TOKEN:", token)
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    const {action} = notification    
    console.log("NOTIFICATION:", notification)    
    // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
    // notification.finish(PushNotificationIOS.FetchResult.NoData)
  },

  // // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
  // senderID: "YOUR GCM (OR FCM) SENDER ID",

  // // IOS ONLY (optional): default: all - Permissions to register.
  // permissions: {
  //   alert: true,
  //   badge: true,
  //   sound: true
  // },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  requestPermissions: true
})
/*
export const pushLocalNotification = (title, message, pressAction) => {
  PushNotification.configure({
    onNotification: function(notification) {
      const {action} = notification
      debugger
      if(action.toLowerCase() == 'yes') {
        pressAction()
      }      
      console.log("NOTIFICATION:", notification)    
      // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
      // notification.finish(PushNotificationIOS.FetchResult.NoData)
    }
  })
  PushNotification.localNotification({
    id: '123',
    /* Android Only Properties */                  
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000      
    ongoing: false, // (optional) set whether this is an "ongoing" notification              

    /* iOS and Android properties */      
    title,
    message,
    playSound: true, // (optional) default: true
    soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)      
    actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
    // actions: '["OK"]'
  })  
  if(isIOS() == true) {
    /*
    let upvoteButton = new NotificationActions.Action({
      activationMode: 'background',
      title: 'Upvote',
      identifier: 'UPVOTE_ACTION'
    }, (res, done) => {
      console.info('upvote button pressed with result: ', res);
      pressAction()
      done(); //important!
    });              
    // Create a category containing our two actions
    let myCategory = new NotificationActions.Category({
      identifier: 'something_happened',
      actions: [upvoteButton],
      forContext: 'default'
    });
     
    // ** important ** update the categories
    NotificationActions.updateCategories([myCategory]);
    */
  } else {
    
  }
}
