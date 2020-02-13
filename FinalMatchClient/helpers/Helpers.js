import {Platform } from 'react-native'
import {Alert} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

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
    if(tokenKey == null) {
        tokenKey = ''
    }
    let customerId = await AsyncStorage.getItem('customerId')
    if(customerId == null) {
        customerId = ''
    } 
    let email = await AsyncStorage.getItem('email')
    if(email == null) {
        email = ''
    }    
    return {tokenKey, customerId, email}
}

export const isIOS = () => {
    return Platform.OS === "ios"
}

export const convertDateTimeToString = (date) => {
    //VD: 2/13/2020, 2:34:23 PM
    return date.toLocaleString()
}








