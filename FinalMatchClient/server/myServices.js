import {urlLoginCustomer, 
    urlRegisterCustomer, 
    urlGetCustomerById,
    urlInsertPlayerService,
    urlCheckPlayerServiceExist,
    urlTokenCheck,
    urlInsertRefereeService,
    urlCheckRefereeServiceExist,
    urlGetCustomerServicesOrders,
    urlUploadAvatar,
    urlGetAvatar,
    urlUpdateSettings, 
    urlInsertStadium,
    urlLoginFacebook
} from './urlNames'
import {getCustomerFromStorage, alert} from '../helpers/Helpers'
import axios from 'axios'
const axiosObject = axios.create()

import {Platform} from 'react-native'

export const registerCustomer = async (email, password) => {
    try {            
        const response = await fetch(await urlRegisterCustomer(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),// stringify de lam gi 
        })               
        const responseJson = await response.json();
        const {result, data, message, time} = responseJson
        const {tokenKeyCustomerId = ''} = data
        
        if (result.toUpperCase() === "OK") {                   
            return { 
                tokenKey: tokenKeyCustomerId.split(";")[0], 
                supplierId: parseInt(tokenKeyCustomerId.split(";")[1]), 
                message: ''}
        } else {            
            return { tokenKey : '', message}
        }
    } catch (error) {        
        alert(`Error register Customer: ${JSON.stringify(error)}`)
        return { tokenKey, message: ''}
    }
}
export const loginCustomer = async (email, password) => {
    try {            
        const response = await fetch(await urlLoginCustomer(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        })             
        const responseJson = await response.json();
        const {result, data, message, time} = responseJson
        const {tokenKeyCustomerId = ''} = data
        
        if (result.toUpperCase() === "OK") {                   
            return { 
                tokenKey: tokenKeyCustomerId.split(";")[0], 
                supplierId: parseInt(tokenKeyCustomerId.split(";")[1]), 
                message: ''}
        } else {            
            return { tokenKey : '', message}
        }
    } catch (error) {        
        return { tokenKey : '', message: error}
    }
}
export const loginFacebookCustomer = async (name, email, facebookId, avatar) => {
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
        const {tokenKeyCustomerId = ''} = data
        if (result.toUpperCase() === "OK") {                   
            return { 
                tokenKey: tokenKeyCustomerId.split(";")[0], 
                supplierId: parseInt(tokenKeyCustomerId.split(";")[1]), 
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
