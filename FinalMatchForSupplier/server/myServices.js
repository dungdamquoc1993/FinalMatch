import {urlLoginSupplier, urlRegisterSupplier, urlInsertPlayerService} from './urlNames'
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
            body: JSON.stringify({email, password}),// stringify de lam gi 
        })               
<<<<<<< HEAD
        const responseJson = await response.json();// chua hieu lam
        const {result, data, errorMessage, time} = responseJson
        const {tokenKey = ''} = data// chua hieu lam
=======
        const responseJson = await response.json();
        const {result, data, message, time} = responseJson
        const {tokenKey = ''} = data
>>>>>>> 27c22c710c6fc0e0e76722cf22c4866e3a2e52d1
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
