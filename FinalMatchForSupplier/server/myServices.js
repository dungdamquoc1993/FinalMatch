import {urlLoginSupplier, 
    urlRegisterSupplier, 
    urlGetSupplierById,
    urlInsertPlayerService,
    urlCheckPlayerServiceExist,
    urlTokenCheck,
    urlInsertRefereeService
} from './urlNames'
import {getSupplierFromStorage} from '../helpers/Helpers'

export const registerSupplier = async (email, password) => {
    try {            
        const response = await fetch(urlRegisterSupplier(), {
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
        debugger
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
        const response = await fetch(urlLoginSupplier(), {
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
        debugger
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
        debugger                     
        const response = await fetch(await urlTokenCheck(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                tokenKey, supplierId
            },
            body: JSON.stringify({}),
        })        
        debugger               
        const responseJson = await response.json()
        debugger
        const {result, data, message, time} = responseJson
        return {result, data, message, time}
    } catch (error) {        
        return error
    }
}
export const insertPlayerService = async (playerName,position,supplierId,latitude,longitude,address,radius) => {
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
export const insertRefereeService = async (refereeName,supplierId,latitude,longitude,address,radius) => {
    try {                    
        const {tokenKey, email} = await getSupplierFromStorage()            
        const response = await fetch(urlInsertRefereeService(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                tokenKey, supplierId
            },
            body: JSON.stringify({refereeName,
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
            return { refereeName, supplierId, message: ''}
        } else {            
            return { refereeName, supplierId, message: 'Cannot insert referee service'}
        }
    } catch (error) {        
        return error
    }
}
export const checkPlayerServiceExist = async (supplierId) => {
    try {                    
        const response = await fetch(urlCheckPlayerServiceExist(supplierId))               
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
        const response = await fetch(urlGetSupplierById(supplierId))               
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