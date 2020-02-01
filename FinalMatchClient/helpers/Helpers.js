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
        customerId = 0
    } else {
        customerId = parseInt(customerId)
    }
    let email = await AsyncStorage.getItem('email')
    if(email == null) {
        email = ''
    }    
    return {tokenKey, customerId, email}
}












