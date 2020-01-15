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
    urlLoginFacebook
} from './urlNames'
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
                message: ''}
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
export const insertRefereeService = async (refereeName,phoneNumber, supplierId,dateOfBirth, latitude,longitude,address,radius) => {
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
        alert("Upload failed!:" + error)
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