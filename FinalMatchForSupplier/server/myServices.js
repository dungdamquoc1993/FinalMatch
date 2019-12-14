import {urlLoginSupplier, urlRegisterSupplier} from './urlNames'
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
        const {result, data, errorMessage, time} = responseJson
        const {tokenKey = ''} = data
        if (result.toUpperCase() === "OK") {                   
            return { tokenKey, errorMessage: ''}
        } else {
            console.log(`Cannot Register. Error: ${responseJson.message}`)
            return { tokenKey, errorMessage}
        }
    } catch (error) {
        console.log(`Cannot Register. Error: ${error}`)
        return { tokenKey, errorMessage: ''}
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
        const {result, data, errorMessage, time} = responseJson
        const {tokenKey = ''} = data
        if (result.toUpperCase() === "OK") {                   
            return { tokenKey, errorMessage: ''}
        } else {
            console.log(`Cannot Login. Error: ${responseJson.message}`)
            return { tokenKey, errorMessage}
        }
    } catch (error) {
        console.log(`Cannot Login. Error: ${error}`)
        return { tokenKey, errorMessage: ''}
    }
}