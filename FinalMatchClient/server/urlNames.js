const GoogleAPIKey = 'AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0'
const SERVER_NAME = '150.95.113.87' //Real Server
const SERVER_PORT = '3001'

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

export const urlgetRefereesAroundOrder = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/orders/getRefereesAroundOrder`
}

export const urlgetPlayersAroundOrder = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/orders/getPlayersAroundOrder`
}

export const urlGetAvatar = (fileName) => {    
    if(fileName.toLowerCase().includes("https://")) {
        return fileName
    }    
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/getImage?fileName=${fileName}`
}

export const urlCreateNewOrder = () => {        
    return `http://${SERVER_NAME}:${SERVER_PORT}/orders/createNewOrder`    
}

export const urlGetOrdersByCustomerId = () => {        
    return `http://${SERVER_NAME}:${SERVER_PORT}/orders/getOrdersByCustomerId`    
}

export const urlInsertCustomerNotificationToken = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/token/insertCustomerNotificationToken`
}

export const urlInsertSupplierNotificationToken = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/token/insertSupplierNotificationToken`
}
export const urlInsertNewChat = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/chat/insertNewChat`
}
export const urlGetChatHistory = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/chat/getChatHistory`
}
export const urlMakeSeen = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/chat/chat/makeSeen`
}




