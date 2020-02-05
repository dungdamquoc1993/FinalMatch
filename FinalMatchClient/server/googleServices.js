import {urlGetAddressFromLatLong} from './urlNames'
import {
    PermissionsAndroid,
    ToastAndroid,
    Platform
} from 'react-native'

export const getAddressFromLatLong = async (latitude, longitude) => {
    try {    
            
        const response = await fetch(urlGetAddressFromLatLong(latitude, longitude))
        const resJson = await response.json();
        const { result, data, message, time } = resJson    
        debugger
        if (result.toUpperCase() === "OK") {
            debugger
            if (data.results.length > 0) {
                let result2 = data.results[0]
                const address = result2["address_components"][0]["long_name"]
                const district = result2["address_components"][1]["long_name"]
                const province = result2["address_components"][2]["long_name"]
                return { address, district, province }
            }
            return { address: '', district: '', province:''}
        } else {
            return { address: '', district: '', province:''}
        }           
        debugger             
    } catch (error) {
        debugger
        console.error(`Cannot get Address From Lat Long. Error: ${error}`)
        return { address: '', district: '', province:''}
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
        ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        ToastAndroid.show('Location permission revoked by user.', ToastAndroid.LONG);
    }

    return false;
}