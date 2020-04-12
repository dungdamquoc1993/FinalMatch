import React, {Component} from 'react'
import {
    NativeModules,
    Platform, Alert,     
    Keyboard} 
from 'react-native'
const {AsyncStorage} = NativeModules

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
export function convertDayMonthYearToStringYYYYMMDD(day, month, year) {
    const strDay = day < 10 ? `0${day}` : `${day}`
    month += 1
    const strMonth = month < 10 ? `0${month}` : `${month}`
    return `${year}-${strMonth}-${strDay}`
}

export function convertDateTimeToString(date) {
    // const day = date.getDate()
    // const month = date.getMonth()
    // const year = date.getFullYear()
    // return convertDayMonthYearToString(day, month, year)
    return date.toLocaleString()    
}
export function convertDateToStringYYYYMMDD(date) {
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    return convertDayMonthYearToStringYYYYMMDD(day, month, year)
}

export function convertDateToStringDDMMYYYY(date) {    
    let strDate = date.toLocaleString()
    let month = strDate.split('/')[0].toString()
    let day = strDate.split('/')[1].toString()
    let year = strDate.split('/')[2].split(',')[0]
    day = day.length < 2 ? `0${day}` : day
    month = month.length < 2 ? `0${month}` : month
    return `${day}/${month}/${year}`
}

export const isIOS = () => {
    return Platform.OS === "ios"
}
export const alert = (content) => Alert.alert("FinalMatch",content,[],{cancelable: true})

export const alertWithOKButton = (content, callback) => {
    const buttons = [        
        { text: 'OK', onPress: () => callback!= null ? callback() : {} },
    ]
    Alert.alert("FinalMatch",content,buttons,{cancelable: false})
}

export const saveSupplierToStorage = async (tokenKey, supplierId, email) => {
    try {
        await AsyncStorage.setItem('tokenKey', tokenKey)
        await AsyncStorage.setItem('supplierId', `${supplierId}`)
        await AsyncStorage.setItem('email', email)        
    } catch (error) {
        alert ("Cannot save data to LocalStorage: "+error)
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
//input {{isGK: false, isCB:true, isMF:false, isCF:false} } => "0100"
export const getPosition = (positionObject) => {
    const {isGK = false, isCB = false, isMF = false, isCF = false} = positionObject
    return `${isGK == true ? 1 : 0}${isCB == true ? 1 : 0}${isMF == true ? 1 : 0}${isCF == true ? 1 : 0}`
}
export const setPosition = (position = '0000') => {
    return {
        isGK: parseInt(position[0]) == 0 ? false : true,
        isCB: parseInt(position[1]) == 0 ? false : true,
        isMF: parseInt(position[2]) == 0 ? false : true,
        isCF: parseInt(position[3]) == 0 ? false : true,
    }
}
export const generateFakeString = () => {
    return `Fake${Math.random().toString(36)}${Math.random().toString(36)}${Math.random().toString(36)}@gmail.com`
}
export const OrderStatus  = {
    PENDING : "pending", 
    ACCEPTED : "accepted",
    CANCELLED: "cancelled", 
    COMPLETED: "completed", 
    MISSED: "missed" 
}
// pending, accepted, cancelled, completed, missed
export const getColorFromStatus = (orderStatus) => {  
    const {
        COLOR_ORDER_STATUS_PENDING,
        COLOR_ORDER_STATUS_ACCEPTED,
        COLOR_ORDER_STATUS_CANCELLED,
        COLOR_ORDER_STATUS_COMPLETED,
        COLOR_ORDER_STATUS_MISSED,	
    } = require('../colors/colors')
    const {PENDING, ACCEPTED, CANCELLED, COMPLETED, MISSED} = OrderStatus        
    switch(orderStatus) {        
        case PENDING:
            return COLOR_ORDER_STATUS_PENDING
        case ACCEPTED:
            return COLOR_ORDER_STATUS_ACCEPTED
        case CANCELLED:
            return COLOR_ORDER_STATUS_CANCELLED
        case COMPLETED:
            return COLOR_ORDER_STATUS_COMPLETED
        case MISSED:
            return COLOR_ORDER_STATUS_MISSED
        default:
            return COLOR_ORDER_STATUS_PENDING
    }
}









