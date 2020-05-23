import {    
    urlGetAddressFromLatLong, 
    urlGetLatLongFromAddress,
    urlGetPlacesFromAddress,
} from './urlNames'
import {translate} from '../languages/languageConfigurations'
import {
    PermissionsAndroid,
    ToastAndroid,
    Platform
} from 'react-native'
import {
    print 
} from '../helpers/Helpers'
// const firebase = require("firebase/app")
import Firebase from 'firebase'
// require("firebase/auth");
// require("firebase/firestore");
// require("firebase/database")

const firebaseConfig = {
    apiKey: "AIzaSyAxPcy5GgWepVoQs2o2fh78vQEAEoSHJPI",
    authDomain: "finalmatch-9f4fe.firebaseapp.com",
    databaseURL: "https://finalmatch-9f4fe.firebaseio.com",
    projectId: "finalmatch-9f4fe",
    storageBucket: "finalmatch-9f4fe.appspot.com",
    messagingSenderId: "863364553369",
    appId: "1:863364553369:web:bee4768735e64cc97c7608"
}
// Initialize Firebase
// firebase.initializeApp(firebaseConfig); 
// export firebase
export const firebaseApp = Firebase.initializeApp(firebaseConfig);
export const firebaseDatabase = firebaseApp.database();
export const firebaseAuthentication = firebaseApp.auth();
firebaseAuthentication.useDeviceLanguage()
export const getAddressFromLatLong = async (latitude, longitude) => {
    try {    
            
        const response = await fetch(urlGetAddressFromLatLong(latitude, longitude))
        const resJson = await response.json();
        const { result, data, message, time } = resJson    
        if (result.toUpperCase() === "OK") {            
            if (data.results.length > 0) {
                
                return data.results[0].formatted_address || 
                    data.results[1].formatted_address || data.results[2].formatted_address
            }
            return ""
        }                        
        return ""
    } catch (error) {        
        console.error(`Cannot get Address From Lat Long. Error: ${error}`)
        return ""
    }
}

export const getLatLongFromAddress = async (address) => {
    try {                
        const response = await fetch(urlGetLatLongFromAddress(address))
        const resJson = await response.json()
        
        const { result, data, message, time } = resJson                   
        if (result.toUpperCase() === "OK") {            
            if (data.results.length > 0) {                
                if(data.results[0].geometry){
                    if(data.results[0].geometry.location) {                                
                        const location = data.results[0].geometry
                        return { latitude: location.lat, longitude: location.lng }
                    }                    
                    return { latitude: 0, longitude: 0 }
                }                 
                return { latitude: 0, longitude: 0 }
            }
            return { latitude: 0, longitude: 0 }
        } 
        return { latitude: 0, longitude: 0 }                  
    } catch (error) {        
        console.error(translate("Cannot get lat, lon from address")+`${error}`)
        return { latitude: 0, longitude: 0 }
    }
}
export const getPlacesFromAddress = async (address) => {
    try {                        
        const response = await fetch(urlGetPlacesFromAddress(address))        
        const responseJSON = await response.json()                
        if(responseJSON.status.toUpperCase() === 'OK') {
            let places = responseJSON.results.map(place => {
                let formattedAddress = place["formatted_address"];
                let latitude = 0.0
                let longitude = 0.0                
                if (place.geometry && place.geometry.location) {
                    latitude = place.geometry.location.lat
                    longitude = place.geometry.location.lng
                }
                let name = place["name"] ? place["name"] : ""
                let placeId = place["place_id"]
                return { formattedAddress, latitude, longitude, name, placeId }
            })                
            return places    
        } else {
            return []
        }        
    } catch (error) {        
        console.error(translate("Cannot get Places From Address:")+`${error}`)
        return []
    }
}

export const checkLocationPermission = async () => {

    if (Platform.OS === 'ios' ||
        (Platform.OS === 'android' && Platform.Version < 23)) {
        return true;
    }

    const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;
    if (status === PermissionsAndroid.RESULTS.DENIED) {
        ToastAndroid.show(translate("Location permission denied by user."), ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        ToastAndroid.show(translate("Location permission denied by user."), ToastAndroid.LONG);
    }

    return false;
}

