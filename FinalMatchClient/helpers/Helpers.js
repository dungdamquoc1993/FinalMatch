import React, {Component} from 'react'
import {
    NativeModules,
    Platform, Alert, 
    useState, Keyboard} from 'react-native'
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
export const generateFakeString = () => {
    return `Fake${Math.random().toString(36)}${Math.random().toString(36)}${Math.random().toString(36)}@gmail.com`
}
export function convertDateToStringDDMMYYYY(date) {    
    // alert("kaka")      
    function pad(s) { return (s < 10) ? '0' + s : s; }    
    return [pad(date.getDate()), pad(date.getMonth()+1), date.getFullYear()].join('/')        
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

//input "0100" => "CB", "1000" => "GK",...
export const convertStringPositionsToPositionName = (stringPosition) => {
    if(stringPosition[0] == "1") {
        return "GK"
    } else if(stringPosition[1] == "1") {
        return "CB"
    } else 
    if(stringPosition[2] == "1") {
        return "MF"
    } else if(stringPosition[3] == "1") {
        return "CF"
    } 
    return "GK"
}

//input: "0100" => 2, input: "0001" => 4, "1000" => 1, "0010" => 3
export const convertStringPositionToNumber = (stringPosition) => {
    for (let i = 0; i < stringPosition.length; i++) {
        if (stringPosition[i] == '1') {
            return i + 1;
        }
    }
    return 0
}
export const alertWithOKButton = (content, callback) => {
    const buttons = [        
        { text: 'OK', onPress: () => callback!= null ? callback() : {} },
    ]
    Alert.alert("FinalMatch",content,buttons,{cancelable: false})
}

// pending, accepted, cancelled, completed, missed
export const getColorFromStatus = (orderStatus) => {  
    const {
        COLOR_ORDER_STATUS_PENDING,
        COLOR_ORDER_STATUS_ACCEPTED,
        COLOR_ORDER_STATUS_CANCELLED,
        COLOR_ORDER_STATUS_COMPLETED,
        COLOR_ORDER_STATUS_MISSED,	
        COLOR_ORDER_STATUS_EXPIRED
    } = require('../colors/colors')
    const {PENDING, ACCEPTED, CANCELLED, COMPLETED, MISSED, EXPIRED} = OrderStatus        
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
        case EXPIRED:
            return COLOR_ORDER_STATUS_EXPIRED            
        default:
            return COLOR_ORDER_STATUS_PENDING
    }
}
export const OrderStatus = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
    MISSED: "missed",
    EXPIRED: 'expired',
}

export const print = (object) => {
    alert(JSON.stringify(object))
    console.log(JSON.stringify(object))
}
export const removeNullProperties = (jsObject) => {
    let clonedObject = {...jsObject}    
    for (key in clonedObject) {        
        if(clonedObject[key] == null) {
            clonedObject[key] = ''
        }
    } 
    return clonedObject
}


