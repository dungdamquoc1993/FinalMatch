import {NativeModules} from 'react-native'
import {isIOS} from './Helpers'
const {NotificationModule} = NativeModules
export const pushLocalNotification = (title, message, pressAction) => {
  console.log("pushLocalNotification")  
  debugger
  NotificationModule.pushLocalNotification("ayyy", "xxx")
}
