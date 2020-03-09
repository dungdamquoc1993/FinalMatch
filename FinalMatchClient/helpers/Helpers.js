import {Platform } from 'react-native'
import {Alert} from 'react-native'
const {AsyncStorage} = NativeModules

export const saveCustomerToStorage = async (tokenKey, customerId, email) => {
    try {
        await AsyncStorage.setItem('tokenKey', tokenKey)
        await AsyncStorage.setItem('customerId', `${customerId}`)
        await AsyncStorage.setItem('email', email)                
    } catch (error) {        
        alert ("Cannot save data to LocalStorage: "+error) //da ngon ngu
    }
}

export const getCustomerFromStorage = async () => {        
    let tokenKey = await AsyncStorage.getItem('tokenKey')    
    let customerId = await AsyncStorage.getItem('customerId')     
    let email = await AsyncStorage.getItem('email')    
    let notificationToken = await AsyncStorage.getItem('notificationToken')    
    return {tokenKey, customerId, email, notificationToken}
}

export const isIOS = () => {
    return Platform.OS === "ios"
}

export const convertDateTimeToString = (date) => {
    //VD: 2/13/2020, 2:34:23 PM
    return date.toLocaleString()
}
//input {{isGK: false, isCB:true, isMF:false, isCF:false} } => "0100"
export const getPosition = (positionObject) => {
    const {isGK = false, isCB = false, isMF = false, isCF = false} = positionObject
    return `${isGK == true ? 1 : 0}${isCB == true ? 1 : 0}${isMF == true ? 1 : 0}${isCF == true ? 1 : 0}`
}
//input: "0100" => 2, input: "0001" => 4, "1000" => 1, "0010" => 3
export const convertStringPositionToNumber = (stringPosition) => {
    for(let i = 0; i < stringPosition.length; i++) {
        if(stringPosition[i] == '1') {
            return i + 1;
        }
    }
    return 0
}









