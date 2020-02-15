const GoogleAPIKey = 'AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0'
const SERVER_NAME = '150.95.113.87' //Real Server
const SERVER_PORT = '3000'

export const urlRegisterCustomer = () => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/customers/register`
}           
export const urlLoginCustomer = () => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/customers/login`
}

export const urlLoginFacebookCustomer = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/customers/loginFacebook`
}
export const urlTokenCheckCustomer = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/token/tokenCheckCustomer`
}

export const urlUpdateCustomerInformation = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/customers/updateCustomerInformation`
}

export const urlGetCustomerInformation = (customerId) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/customers/urlGetCustomerInformation?customerId=${customerId}`
}
export const urlGetAddressFromLatLong = (latitude, longitude) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/googleServiceRoute/getAddressFromLatLong?latitude=${latitude}&longitude=${longitude}`
}

export const urlGetLatLongFromAddress = (address) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/googleServiceRoute/getLatLongFromAddress?address=${address}`
}

export const urlGetStadiumsAroundPoint = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/stadium/getStadiumsAroundPoint`
}
export const urlGetPlacesFromAddress = (address) => {        
    return `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${address}&key=${GoogleAPIKey}`
}

export const urlGetRefereeAroundOrder = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/orders/getRefereeAroundOrder`
}

export const urlGetPlayerAroundOrder = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/orders/getPlayerAroundOrder`
}

