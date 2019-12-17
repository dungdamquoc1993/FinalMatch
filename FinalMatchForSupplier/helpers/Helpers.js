import {Platform } from 'react-native'
import {Alert} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

export const daysBetween2Dates = (bigDay, smallDay) => {   
    if(bigDay < smallDay) {
        return 0
    }
    let times =   bigDay.getTime() - smallDay.getTime()
    let days = Math.floor(times / (1000 * 3600 * 24 * 365))
    return days
}
export function convertDayMonthYearToString(day, month, year) {
    const strDay = day < 10 ? `0${day}` : `${day}`
    month += 1
    const strMonth = month < 10 ? `0${month}` : `${month}`
    return `${strDay}/${strMonth}/${year}`
}
export function convertDateToString(date) {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return convertDayMonthYearToString(day, month, year)
}
export const isIOS = () => {
    return Platform.OS === "ios"
}
export const alert = (content) => Alert.alert("FinalMatch",content,[],{cancelable: true})

export const alertWithOKButton = (content, callback) => {
    const buttons = [        
        { text: 'OK', onPress: () => callback() },
    ]
    Alert.alert("FinalMatch",content,buttons,{cancelable: false})
}

export const saveSupplierToStorage = async (tokenKey, supplierId, email) => {
    try {
        await AsyncStorage.setItem('tokenKey', tokenKey)
        await AsyncStorage.setItem('supplierId', `${supplierId}`)
        await AsyncStorage.setItem('tokemailenKey', email)
    } catch (error) {
        console.log("Cannot save data to LocalStorage: "+error)
    }
}

export const getSupplierFromStorage = async () => {
    let tokenKey = await AsyncStorage.getItem('tokenKey')
    if(tokenKey == null) {
        tokenKey = ''
    }
    let supplierId = await AsyncStorage.getItem('supplierId')
    if(supplierId == null) {
        supplierId = 0
    } else {
        supplierId = parseInt(supplierId)
    }
    let email = await AsyncStorage.getItem('email')
    if(email == null) {
        email = ''
    }
    return {tokenKey, supplierId, email}
}