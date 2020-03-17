const GoogleAPIKey = 'AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0'
//const SERVER_NAME = '192.168.1.59' //mrDung
//const SERVER_NAME = '192.168.1.149' //Giap Nhat
// const SERVER_NAME = '192.168.1.88' //mrHoang
const SERVER_NAME = '150.95.113.87' //Real Server
const SERVER_PORT = '3001'

export const urlRegisterSupplier = () => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/register`
}           
export const urlLoginSupplier = () => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/login`
}
export const urlInsertPlayerService = () => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/playerServices/insertPlayerService`
}
export const urlInsertRefereeService = () => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/refereeServices/insertRefereeService`
}
export const urlCheckRefereeServiceExist = (supplierId) => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/refereeServices/checkRefereeServiceExist?supplierId=${supplierId}`
}


export const urlGetSupplierById = (supplierId) => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/urlGetSupplierById?supplierId=${supplierId}`
}
export const urlCheckPlayerServiceExist = (supplierId) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/playerServices/checkPlayerServiceExist?supplierId=${supplierId}`
}
export const urlTokenCheck = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/token/tokenCheck`
}
export const urlGetAddressFromLatLong = (latitude, longitude) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/googleServiceRoute/getAddressFromLatLong?latitude=${latitude}&longitude=${longitude}`
}

export const urlGetSupplierServicesOrders = (supplierId) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/getSupplierServicesOrders?supplierId=${supplierId}`
}
export const urlUploadAvatar = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/uploadAvatar`
}
//Get Avatar
export const urlGetAvatar = (fileName) => {    
    if(fileName.toLowerCase().includes("https://")) {
        return fileName
    }    
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/getImage?fileName=${fileName}`
}
export const urlUpdateSettings = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/updateSettings`
}
export const urlInsertStadium = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/stadium/insertStadium`
}
export const urlLoginFacebook = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/loginFacebook`
}
export const urlGetOrdersBySupplierId = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/orders/getOrdersBySupplierId`
}
export const urlUpdateOrderStatus = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/orders/updateOrderStatus`
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
    return `http://${SERVER_NAME}:${SERVER_PORT}/chat/makeSeen`
}

export const urlGetNotificationsBySupplierId = (supplierId) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/notifications/getNotificationsBySupplierId?supplierId=${supplierId}`
}
export const urlGetNotificationsByCustomerId = (customerId) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/notifications/getNotificationsByCustomerId?customerId=${customerId}`
}



