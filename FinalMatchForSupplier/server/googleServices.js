import {urlGetAddressFromLatLong} from './urlNames'
export const getAddressFromLatLong = async (latitude, longitude) => {
    try {
        const response = await fetch(
            urlGetAddressFromLatLong(latitude, longitude)    
        );
        const responseJson = await response.json();
        if (response.ok == true) {
            //console.log(JSON.stringify(responseJson.results[0]["address_components"][0]["long_name"]))
            if (responseJson.results.length > 0) {
                const address = responseJson.results[0]["address_components"][0]["long_name"]
                const district = responseJson.results[0]["address_components"][1]["long_name"]
                const province = responseJson.results[0]["address_components"][2]["long_name"]
                return { address, district, province }
            }
            return { address: '', district: '', province:''}
        }
    } catch (error) {
        console.error(`Cannot get Address From Lat Long. Error: ${error}`)
        return { address: '', district: '', province:''}
    }
}