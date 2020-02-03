
import { Platform } from 'react-native'
import {
    urlLoginCustomer,
    urlRegisterCustomer,
    urlLoginFacebookCustomer,    
    urlTokenCheckCustomer,
} from './urlNames'
import { alert } from '../helpers/Helpers'
import axios from 'axios'
const axiosObject = axios.create()

export const registerCustomer = async (name, email, password) => {
    try {        
        const response = await fetch(await urlRegisterCustomer(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        })        
        const responseJson = await response.json();
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
            },
            body: JSON.stringify({ email, password }),
        })
        const responseJson = await response.json();
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
            },
            body: JSON.stringify({ name, email, facebookId, avatar }),
        })
        const responseJson = await response.json();
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
                tokenKey, customerId
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

