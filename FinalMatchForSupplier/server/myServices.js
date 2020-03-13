import {NativeModules} from 'react-native'
import {urlLoginSupplier, 
    urlRegisterSupplier, 
    urlGetSupplierById,
    urlInsertPlayerService,
    urlCheckPlayerServiceExist,
    urlTokenCheck,
    urlInsertRefereeService,
    urlCheckRefereeServiceExist,
    urlGetSupplierServicesOrders,
    urlUploadAvatar,
    urlGetAvatar,
    urlUpdateSettings, 
    urlInsertStadium,
    urlLoginFacebook,
    urlGetOrdersBySupplierId,
    urlUpdateOrderStatus,
    urlInsertCustomerNotificationToken,
    urlInsertSupplierNotificationToken,
    urlInsertNewChat,
    urlGetChatHistory,
    urlMakeSeen,
} from './urlNames'
const {AsyncStorage} = NativeModules
import {getSupplierFromStorage, alert} from '../helpers/Helpers'
import axios from 'axios'
const axiosObject = axios.create()

import {Platform} from 'react-native'

export const registerSupplier = async (email, password) => {
    try {            
        const response = await fetch(await urlRegisterSupplier(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),// stringify de lam gi 
        })               
        const responseJson = await response.json();
        const {result, data, message, time} = responseJson
        const {tokenKeySupplierId = ''} = data
        
        if (result.toUpperCase() === "OK") {                   
            return { 
                tokenKey: tokenKeySupplierId.split(";")[0], 
                supplierId: parseInt(tokenKeySupplierId.split(";")[1]), 
                message: ''}
        } else {            
            return { tokenKey : '', message}
        }
    } catch (error) {        
        alert(`Error register Supplier: ${JSON.stringify(error)}`)
        return { tokenKey, message: ''}
    }
}
export const loginSupplier = async (email, password) => {
    try {            
        const response = await fetch(await urlLoginSupplier(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        })             
        const responseJson = await response.json();
        const {result, data, message, time} = responseJson
        const {tokenKeySupplierId = ''} = data
        
        if (result.toUpperCase() === "OK") {                   
            return { 
                tokenKey: tokenKeySupplierId.split(";")[0], 
                supplierId: parseInt(tokenKeySupplierId.split(";")[1]), 
                message: ''
            }
        } else {            
            return { tokenKey : '', message}
        }
    } catch (error) {        
        return { tokenKey : '', message: error}
    }
}
export const loginFacebook = async (name, email, facebookId, avatar) => {
    try {            
        const response = await fetch(await urlLoginFacebook(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, email, facebookId, avatar}),
        })             
        const responseJson = await response.json();
        const {result, data, message, time} = responseJson                
        const {tokenKeySupplierId = ''} = data
        if (result.toUpperCase() === "OK") {                   
            return { 
                tokenKey: tokenKeySupplierId.split(";")[0], 
                supplierId: parseInt(tokenKeySupplierId.split(";")[1]), 
                message: ''}
        } else {            
            return { tokenKey : '', message}
        }
    } catch (error) {        
        return { tokenKey : '', message: error}
    }
}
export const tokenCheck = async (tokenKey,supplierId) => {
    try {       
                             
        const response = await fetch(await urlTokenCheck(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                tokenKey, supplierId
            },
            body: JSON.stringify({}),
        })        
                       
        const responseJson = await response.json()
        
        const {result, data, message, time} = responseJson
        return {result, data, message, time}
    } catch (error) {        
        return {result:'failed', data: {}, message: error}        
    }
}
export const insertPlayerService = async (playerName,
    price, 
    position,supplierId,latitude,longitude,address,radius) => {
    try {                    
        const {tokenKey, email} = await getSupplierFromStorage()            
        const response = await fetch(urlInsertPlayerService(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                tokenKey, supplierId
            },
            body: JSON.stringify({playerName,
                price,
                position,
                supplierId,
                latitude,
                longitude,
                address,
                radius}),
        })                       
        const responseJson = await response.json();
        const {result, data, message, time} = responseJson
        if (result.toUpperCase() === "OK") {                 
            //Logger ??  
            return { playerName, position, supplierId, message: ''}
        } else {            
            return { playerName, position, supplierId, message: 'Cannot insert player service'}
        }
    } catch (error) {        
        return error
    }
}
export const insertRefereeService = async (refereeName,
    price,
    phoneNumber, supplierId,dateOfBirth, latitude,longitude,address,radius) => {
    try {             
        const {tokenKey, email} = await getSupplierFromStorage()                
        
        const response = await fetch(await urlInsertRefereeService(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                tokenKey, supplierId
            },
            body: JSON.stringify({refereeName,
                price,
                phoneNumber,
                supplierId,
                dateOfBirth,
                latitude,
                longitude,
                address,
                radius}),
        })                       
        const responseJson = await response.json();
        const {result, data, message, time} = responseJson
        if (result.toUpperCase() === "OK") {                 
            //Logger ??  
            return { refereeName, supplierId, message: ''}
        } else {            
            return { refereeName, supplierId, message}
        }        
    } catch (error) {        
        return error
    }
}
export const checkPlayerServiceExist = async (supplierId) => {
    try {                    
        const response = await fetch(await urlCheckPlayerServiceExist(supplierId))               
        const responseJson = await response.json();
        const {result, data, message, time} = responseJson                   
        if (result.toUpperCase() === "OK") {                 
            //Logger ??              
            return { data, message: ''}
        } else {    
            return { data, message}
        }
    } catch (error) {               
        return { data, message: error}
    }
}

export const checkRefereeServiceExist = async (supplierId) => {
    try {                    
       
        const response = await fetch(await urlCheckRefereeServiceExist(supplierId))                       
        const responseJson = await response.json();                
        const {result, data, message, time} = responseJson                   
        if (result.toUpperCase() === "OK") {                 
            //Logger ??              
            return { data, message: ''}
        } else {    
            return { data, message}
        }
    } catch (error) {               
        return { data, message: error}
    }
}

export const getSupplierById = async (supplierId) => {
    try {     
               
        const response = await fetch(await urlGetSupplierById(supplierId))               
        const responseJson = await response.json();
        
        const {result, data, message, time} = responseJson   
                     
        let { phoneNumber = '', 
                    latitude = '', 
                    longitude = '', 
                    radius = 0, address= ''} = data
        phoneNumber = phoneNumber || ''
        latitude = latitude || 0.0
        longitude = longitude || 0.0
        radius = radius || 0.0
        address = address || ''
        if (result.toUpperCase() === "OK") {                 
            //Logger ??              
            return { data: {phoneNumber, latitude, longitude, radius, address}, message: ''}
        } else {            
            return { data: {phoneNumber, latitude, longitude, radius, address}, message}
        }
    } catch (error) {        
        return { data, message: error}
    }
}

export const getSupplierServicesOrders = async (supplierId) => {
    try {                    
        const response = await fetch(await urlGetSupplierServicesOrders(supplierId))               
        const responseJson = await response.json();                
        const {result, data, message, time} = responseJson                                   
        if (result.toUpperCase() === "OK") {                 
            //Logger ??              
            return { data, message: ''}
        } else {    
            return { data, message}
        }
    } catch (error) {               
        return { data, message: error}
    }
}

//Upload image
export const createFormData = (photos, body) => {
    const data = new FormData();    
    var i = 0      
    photos.forEach(photo => {
              
        photo.filename = photo.path.split('/').pop()            
              
        data.append(`photo${i}`, {
            name: photo.filename,
            type: photo.mime,
            uri:
                Platform.OS === "android" ? photo.path : photo.path.replace("file://", "")
        });
              
        i = i + 1
    })
    Object.keys(body).forEach(key => {
        data.append(key, body[key]);
    });        
    return data;
}

export const postUploadPhoto = async (photos, supplierId) => {
    try {         
        //alert(JSON.stringify(photos))           
        const {tokenKey, email} = await getSupplierFromStorage()                
    
        axiosObject.defaults.timeout = 5000;
        let response =  await axiosObject.post(urlUploadAvatar(),
            createFormData(photos, { name: "Hoang" }),
             {  
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    tokenKey, supplierId
                },                    
        });        
        //let responseJson = await response.json()
        let responseJson = await response.data                
        if(responseJson.result === "ok") {                
            let imageUrls = responseJson.data.map(fileName => {
                return fileName
            })                        
            return { data: imageUrls, message: ''}            
        } else {            
            return { data, message: 'Cannot upload image'}
        }                
    } catch (error) {        
        alert("Upload failed!:" + JSON.stringify(error))
    }
}

export const updateSettings = async (supplierId,
            playerPrice,
            refereePrice,
            name,
            avatar,
            dateOfBirth,phoneNumber,address,
            latitude,longitude,radius,playerName,position,refereeName) => {
                        
    try {                            
        const {tokenKey, email} = await getSupplierFromStorage()                     
        const response = await fetch(urlUpdateSettings(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                tokenKey, supplierId
            },
            body: JSON.stringify({
                name,
                playerPrice,
                refereePrice,
                avatar,
                dateOfBirth,
                phoneNumber,
                address,
                latitude,
                longitude,
                radius,
                playerName,
                position,
                refereeName}),
        })                               
        const responseJson = await response.json();                
        const {result, data, message, time} = responseJson
        if (result.toUpperCase() === "OK") {                 
            //Logger ??  
            return { data, message: ''}
        } else {            
            return { data, message: 'Cannot update settings'}
        }
    } catch (error) {        
        return error
    }
}

export const insertSupplierNotificationToken = async (notificationToken) => {
    //Hàm này gọi ở React Native(vì trên này mới lấy đc supplierId), khi có token dưới ios/android, sẽ gửi Event lên RN, RN gọi hàm này
    try {
        const { tokenKey, supplierId } = await getSupplierFromStorage()
        if(supplierId == 0) {            
            await AsyncStorage.setItem('notificationToken', notificationToken)
            return
        }
        const response = await fetch(urlInsertSupplierNotificationToken(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                tokenKey, supplierId
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

export const insertStadium = async (type,
                                    stadiumName,
                                    latitude,
                                    longitude,
                                    address,
                                    phoneNumber,
                                    supplierId) => {
    try {                    
        const {tokenKey, email} = await getSupplierFromStorage()            
        const response = await fetch(urlInsertStadium(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                tokenKey, supplierId
            },
            body: JSON.stringify({
                    type,
                    stadiumName,
                    latitude,
                    longitude,
                    address,
                    phoneNumber,
                    supplierId}),
        })                       
        const responseJson = await response.json();
        const {result, data, message, time} = responseJson
        if (result.toUpperCase() === "OK") {                 
            //Logger ??  
            return { stadiumName, supplierId, message: ''}
        } else {            
            return { stadiumName, supplierId, message}
        }
    } catch (error) {        
        return error
    }
}
export const getOrdersBySupplierId = async () => {
    try {
        const { tokenKey, supplierId} = await getSupplierFromStorage()        
        const response = await fetch(urlGetOrdersBySupplierId(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                tokenKey, supplierId
            },
            body: JSON.stringify({
                supplierId
            }),
        })        
        const responseJson = await response.json();        
        const { result, data, message, time } = responseJson        
        if (result.toUpperCase() === "OK") {
            //Logger ??  
            return data
        } else {
            return []
        }
    } catch (error) {
        alert("Cannot get orders from supplierId"+error)
        
        return []
    }
}
export const updateOrderStatus = async (orderId, status) => {
    try {
        const { tokenKey, supplierId} = await getSupplierFromStorage()
        
        const response = await fetch(urlUpdateOrderStatus(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                tokenKey, supplierId
            },
            body: JSON.stringify({
                orderId, status
            }),
        })
        
        const responseJson = await response.json();
        
        const {result, data} = responseJson
        
        if (result.toUpperCase() === "OK") {
            //Logger ??  
            return data
        } else {
            return {}
        }
    } catch (error) {
        alert("Cannot update order's status to"+error)
        
        return {}
    }
}
export const insertNewChat = async ({orderId, sms, senderId}) => {
    try {
        const { tokenKey, supplierId, customerId } = await getSupplierFromStorage()
        const response = await fetch(urlInsertNewChat(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                tokenKey, supplierId, customerId
            },
            body: JSON.stringify({
                orderId, sms, senderId
            }),
        })
        
        const responseJson = await response.json();        
        const {result, data} = responseJson
        return result.toUpperCase() === "OK" ? data : []
    } catch (error) {
        alert("Cannot insert new chat. Error: "+error)        
        return []
    }
}

export const getChatHistory = async ({customerOrSupplierId}) => {
    try {
        const { tokenKey, supplierId } = await getSupplierFromStorage()
        const response = await fetch(urlInsertNewChat(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                tokenKey, supplierId
            },
            body: JSON.stringify({
                customerOrSupplierId
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
export const makeSeen = async () => {
    try {
        const { tokenKey, supplierId, customerId } = await getSupplierFromStorage()
        const response = await fetch(urlInsertNewChat(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                tokenKey, supplierId, customerId
            },
            body: JSON.stringify({
                
            }),
        })        
        const responseJson = await response.json()        
        const {result, data, message, time} = responseJson          
        if (result.toUpperCase() === "OK") {                 
            //Logger ??              
            return { data, message: ''}
        } else {    
            return { data, message}
        }
    } catch (error) {               
        return { data, message: error}
    }
}


