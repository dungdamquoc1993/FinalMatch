import i18n from "i18n-js"
import { Platform, NativeModules } from 'react-native'
import {getCustomerFromStorage} from '../helpers/Helpers'
import {
    urlLoginCustomer,
    urlRegisterCustomer,
    urlLoginFacebookCustomer,    
    urlTokenCheckCustomer,
    urlUpdateCustomerInformation, 
    urlGetCustomerInformation,
    urlGetStadiumsAroundPoint,
    urlgetPlayersAroundOrder, 
    urlgetRefereesAroundOrder,
    urlCreateNewOrder,
    urlGetOrdersByCustomerId,
    urlGetAvatar,
    urlInsertCustomerNotificationToken,
    urlInsertNewChat,
    urlGetChatHistory,
    urlMakeSeen,
    urlUpdateOrderStatus
} from './urlNames'
import { alert } from '../helpers/Helpers'
import axios from 'axios'
const axiosObject = axios.create()
const {AsyncStorage} = NativeModules

export const registerCustomer = async (name, email, password) => {
    try {        
        const response = await fetch(await urlRegisterCustomer(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
            },
            body: JSON.stringify({ name, email, password }),
        })        
        const responseJson = await response.json()
        const { result, data, message } = responseJson        
        const { customerId, tokenKey } = data
        if (result.toUpperCase() === "OK") {
            return { customerId, tokenKey, message }
        } else {
            return { tokenKey: '', message }
        }
    } catch (error) {
        alert("Error register Customer: " + JSON.stringify(error))
        return { tokenKey, message: '' }
    }
}
export const loginCustomer = async (email, password) => {
    try {        
        const response = await fetch(await urlLoginCustomer(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
            },
            body: JSON.stringify({ email, password }),
        })        
        const responseJson = await response.json()
        const { result, data, message } = responseJson
        const { customerId, tokenKey } = data

        if (result.toUpperCase() === "OK") {
            return { customerId, tokenKey, message }
        } else {
            return { tokenKey: '', message }
        }
    } catch (error) {
        return { tokenKey: '', message: JSON.stringify(error) }
    }
}
export const loginFacebookCustomer = async (name, email, facebookId, avatar) => {
    try {
        const response = await fetch(await urlLoginFacebookCustomer(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
            },
            body: JSON.stringify({ name, email, facebookId, avatar }),
        })
        const responseJson = await response.json()
        const { result, data, message } = responseJson
        const { customerId, tokenKey } = data
        if (result.toUpperCase() === "OK") {
            return { customerId, facebookId: data.facebookId, tokenKey, message }
        } else {
            return { tokenKey: '', message }
        }
    } catch (error) {
        return { tokenKey: '', message: JSON.stringify(error) }
    }
}

export const tokenCheckCustomer = async (tokenKey, customerId) => {
    try {        
        const response = await fetch(await urlTokenCheckCustomer(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
                tokenKey, customerId,
            },
            body: JSON.stringify({}),
        })        
        const responseJson = await response.json()
        const { result, data, message} = responseJson
        return { result, data, message}
    } catch (error) {
        console.log(error)        
        return { result: 'failed', data: {}, message: JSON.stringify(error) }
    }
}


export const updateCustomerInformation = async (name, phoneNumber) => {
    try {        
        const {tokenKey, customerId} = await getCustomerFromStorage()            
        let url = await urlUpdateCustomerInformation()
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
                tokenkey: tokenKey, customerid: customerId
            },
            body: JSON.stringify({ name, phoneNumber }),
        })        
        
        const responseJson = await response.json()
        
        const { result,message } = responseJson                
        
        if(result.toLowerCase() === 'ok') {
            return {message, error: null}
        } else {
            return {message, error: message}
        }        
    } catch (error) {        
        
        return {
            message: "Error update Customer' information" + JSON.stringify(error),
            error
         }
    }
}
export const getCustomerInformation = async (customerId) => {
    try {               
             
        const response = await fetch(await urlGetCustomerInformation(customerId))               
        const responseJson = await response.json()                
        
        const {result, data, message, time} = responseJson                                           
        
        if (result.toUpperCase() === "OK") {                             
            return { data, message, error: null}
        } else {    
            return { data, message, error: message}
        }
        
    } catch (error) {               
        
        return { data, message: error}
    }
}
export const getStadiumsAroundPoint = async (latitude, longitude, radius) => {
    try {        
           
        const {tokenKey, customerId} = await getCustomerFromStorage()            
        const response = await fetch(await urlGetStadiumsAroundPoint(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
                tokenkey: tokenKey, customerid: customerId
            },
            body: JSON.stringify({ latitude, longitude,radius }),
        })        
        
        const responseJson = await response.json()
        
        const {result, count, data, message} = responseJson 
                                                             
        if (result.toUpperCase() === "OK") {                             
            return { data, message, error: null}
        } else {    
            return { data, message, error: message}
        }        
    } catch (error) {   
                        
        return { data, message: error, error}
    }
}

export const getRefereesAroundOrder = async (radius, latitude, longitude) => {
    try {        
        const {tokenKey, customerId} = await getCustomerFromStorage()            
        const response = await fetch(await urlgetRefereesAroundOrder(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
                tokenkey: tokenKey, customerid: customerId
            },
            body: JSON.stringify({ radius, latitude, longitude }),
        })        
        
        const responseJson = await response.json()        
        const { result,message, data } = responseJson                    
        if(result.toLowerCase() === 'ok') {
            return data
        } else {
            return []
        }        
    } catch (error) {                
        return []
    }
}


export const getPlayersAroundOrder = async (radius, latitude, longitude, position) => {
    try {        
        const {tokenKey, customerId} = await getCustomerFromStorage()              
        const response = await fetch(await urlgetPlayersAroundOrder(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
                tokenkey: tokenKey, customerid: customerId
            },
            body: JSON.stringify({ radius, latitude, longitude, position}),
        })                
        const responseJson = await response.json()        
        const { result,message, data } = responseJson                        
        if(result.toLowerCase() === 'ok') {            
            return data
        } else {                
            return []
        }        
    } catch (error) {                        
        return []
    }
}

export const createNewOrder = async (    
    supplierId, 
    latitude,
    longitude,
    customerId,
    typeRole,
    dateTimeStart, //phải là kiểu Date    
    ) => {
        
    //if order exists, do nothing
    dateTimeStart.setMilliseconds(0);
    dateTimeStart.setSeconds(0)        
    try {        
        const {tokenKey} = await getCustomerFromStorage()              
        const response = await fetch(await urlCreateNewOrder(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
                tokenkey: tokenKey, customerid: customerId
                //Cả customer và supplier đều thay đổi đc order
            },
            body: JSON.stringify({
                supplierId,
                latitude,
                longitude, 
                customerId,
                typeRole,
                dateTimeStart: dateTimeStart.toUTCString()//phải chuyển sang STRING dạng: Tue, 18 Feb 2020 09:48:32 GMT
            }),
        })    
        debugger
        const responseJson = await response.json()        
        debugger
        const { result,message, data } = responseJson                        
        debugger
        if(result.toLowerCase() === 'ok') {            
            return data
        } else {                
            return {}
        }        
    } catch (error) {         
        console.log(error)               
        debugger
        return {}
    }
}

export const getOrdersByCustomerId = async () => {    
    try {        
        
        const {tokenKey, customerId} = await getCustomerFromStorage()              
        const response = await fetch(await urlGetOrdersByCustomerId(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
                tokenkey: tokenKey, customerid: customerId                
            },
            body: JSON.stringify({
                customerId,
            }),
        })    
        debugger
                    
        const responseJson = await response.json()        
        
        const { result,message, data } = responseJson                        
        
        if(result.toLowerCase() === 'ok') {            
            return data
        } else {                
            return []
        }        
    } catch (error) {         
        
        console.log(error)               
        return [] 
    }
}
export const updateOrderStatus = async (orderId, status) => {
    try {
        const { tokenKey, customerId} = await getCustomerFromStorage()        
        const response = await fetch(urlUpdateOrderStatus(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
                tokenKey, customerId
            },
            body: JSON.stringify({
                orderId, status
            }),
        })
        
        const responseJson = await response.json();        
        const {result, data} = responseJson        
        debugger
        return result.toUpperCase() === "OK"
    } catch (error) {                
        return false
    }
}
export const insertCustomerNotificationToken = async (notificationToken) => {
    //Hàm này gọi ở React Native(vì trên này mới lấy đc customerId), khi có token dưới ios/android, sẽ gửi Event lên RN, RN gọi hàm này
    try {        
        const { tokenKey, customerId } = await getCustomerFromStorage()                
        const response = await fetch(urlInsertCustomerNotificationToken(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
                tokenKey, customerId
            },
            body: JSON.stringify({
                notificationToken
            }),
        })
        
        const responseJson = await response.json();
        
        const { result, data, message, time } = responseJson
        
        if (result.toUpperCase() === "OK") {
            //Logger ??  
            
            return { data, message: '', error: null}
        } else {
            return { data, message: 'Cannot update settings', error: 'Cannot update settings'}
        }
    } catch (error) {
        
        return { data: null, message: 'Cannot update settings', error}
    }
}
export const insertNewChat = async ({orderId, sms, senderId}) => {
    try {
        debugger
        const { tokenKey, supplierId, customerId } = await getCustomerFromStorage()        
        debugger
        const response = await fetch(urlInsertNewChat(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
                tokenKey, supplierId, customerId
            },
            body: JSON.stringify({
                orderId, sms, senderId
            }),
        })
        debugger
        const responseJson = await response.json();        
        debugger
        const {result, data} = responseJson        
        return result.toUpperCase() === "OK"
    } catch (error) {        
        alert("Cannot insert new chat. Error: "+error)        
        return false
    }
}

export const getChatHistory = async () => {
    try {
        const { tokenKey, customerId } = await getCustomerFromStorage()
        let url = await urlGetChatHistory()
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
                tokenKey, customerId
            },
            body: JSON.stringify({
                customerOrSupplierId: customerId
            }),
        })
        
        const responseJson = await response.json();        
        
        const {result, data} = responseJson
        return result.toUpperCase() === "OK" ? data : []
    } catch (error) {
        alert("Cannot get chat history, error : "+error)        
        return []
    }
}
export const makeSeen = async ({orderId, senderId}) => {
    try {
        const { tokenKey, supplierId, customerId } = await getSupplierFromStorage()        
        const response = await fetch(urlMakeSeen(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                locale: i18n.locale,
                tokenKey, supplierId, customerId
            },
            body: JSON.stringify({
                orderId, senderId
            }),
        })        
        const responseJson = await response.json()        
        const {result, data, message, time} = responseJson          
        return result.toUpperCase() === "OK"
    } catch (error) {               
        return false
    }
}


