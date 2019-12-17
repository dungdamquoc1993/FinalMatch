import {urlLoginSupplier, urlRegisterSupplier, urlRegisterPlayer} from './urlNames'
import {urlLoginSupplier, 
    urlRegisterSupplier, 
    urlGetSupplierById,
    urlInsertPlayerService,
    urlCheckPlayerServiceExist
} from './urlNames'
import {
    PermissionsAndroid,
    ToastAndroid,
    Platform
} from 'react-native'

export const registerSupplier = async (email, password) => {
    try {            
        const response = await fetch(urlRegisterSupplier(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        })               
        const responseJson = await response.json();
        const {result, data, message, time} = responseJson
        const {tokenKey = ''} = data
        if (result.toUpperCase() === "OK") {                   
            return { tokenKey, message: ''}
        } else {            
            return { tokenKey, message}
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
        const {tokenKey = ''} = data
        if (result.toUpperCase() === "OK") {                   
            return { tokenKey, message: ''}
        } else {            
            return { tokenKey, message}
        }
    } catch (error) {        
        return { tokenKey, message: error}
    }
}
export const insertPlayerService = async (
    playerName,
    position,
    supplierId,
    latitude,
    longitude,
    address,
    radius) => {
    try {            
        const response = await fetch(urlInsertPlayerService(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                playerName,
                position,
                supplierId,
                latitude,
                longitude,
                address,
                radius}),
        })               
        const responseJson = await response.json();
        const {result, data, message, time} = responseJson
        const {playerName = '', position = '0000', supplierId = 0} = data
        if (result.toUpperCase() === "OK") {                 
            //Logger ??  
            return { playerName, position, supplierId, message: ''}
        } else {            
            return { playerName, position, supplierId, message}
        }
    } catch (error) {        
        return { data, message: error}
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
        const response = await fetch(urlGetSupplierById())               
        const responseJson = await response.json();
        const {result, data, message, time} = responseJson        
        const {name = '', phoneNumber = '', latitude = '', longitude = '', radius = 0, address= ''} = data
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

export const registerPlayer = async(name, phoneNumber, address, radius, position ) => {
    try{
        const response = await fetch(urlRegisterPlayer(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, phoneNumber, address, radius, isGK, isCB, isMF, isCF}),
        })
        const responseJson = await response.json();
        const {result,data,}
    }
}


