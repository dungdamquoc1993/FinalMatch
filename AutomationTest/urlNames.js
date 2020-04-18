const i18n = require("i18n-js") 
const GoogleAPIKey = 'AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0'
const SERVER_NAME = '150.95.113.87' //Real Server
const SERVER_PORT = '3001'

const urlRegisterCustomer = () => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/customers/register`
}           
const urlLoginCustomer = () => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/customers/login`
}

const urlLoginFacebookCustomer = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/customers/loginFacebook`
}
const urlTokenCheckCustomer = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/token/tokenCheckCustomer`
}

const urlUpdateCustomerInformation = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/customers/updateCustomerInformation`
}

const urlGetCustomerInformation = (customerId) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/customers/urlGetCustomerInformation?customerId=${customerId}&locale=${i18n.locale}`
}

const urlGetLatLongFromAddress = (address) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/googleServiceRoute/getLatLongFromAddress?address=${address}&locale=${i18n.locale}`
}

const urlGetStadiumsAroundPoint = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/stadium/getStadiumsAroundPoint`
}
const urlGetPlacesFromAddress = (address) => {        
    return `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${address}&key=${GoogleAPIKey}&locale=${i18n.locale}`
}

const urlgetRefereesAroundOrder = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/orders/getRefereesAroundOrder`
}

const urlgetPlayersAroundOrder = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/orders/getPlayersAroundOrder`
}

//Get Avatar
const urlGetAvatar = (fileName) => {    
    if(fileName.toLowerCase().includes("https://")) {
        return fileName
    }    
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/getImage?fileName=${fileName}&locale=${i18n.locale}`
}

const urlCreateNewOrder = () => {        
    return `http://${SERVER_NAME}:${SERVER_PORT}/orders/createNewOrder`    
}

const urlGetOrdersByCustomerId = () => {        
    return `http://${SERVER_NAME}:${SERVER_PORT}/orders/getOrdersByCustomerId`    
}

const urlGetChatHistory = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/chat/getChatHistory`
}
const urlMakeSeen = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/chat/chat/makeSeen`
}

const urlRegisterSupplier = () => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/register`
}           
const urlLoginSupplier = () => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/login`
}
const urlInsertPlayerService = () => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/playerServices/insertPlayerService`
}
const urlInsertRefereeService = () => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/refereeServices/insertRefereeService`
}
const urlCheckRefereeServiceExist = (supplierId) => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/refereeServices/checkRefereeServiceExist?supplierId=${supplierId}&locale=${i18n.locale}`
}

const urlGetSupplierById = (supplierId) => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/urlGetSupplierById?supplierId=${supplierId}&locale=${i18n.locale}`
}
const urlCheckPlayerServiceExist = (supplierId) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/playerServices/checkPlayerServiceExist?supplierId=${supplierId}&locale=${i18n.locale}`
}
const urlTokenCheck = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/token/tokenCheck`
}
const urlGetAddressFromLatLong = (latitude, longitude) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/googleServiceRoute/getAddressFromLatLong?latitude=${latitude}&longitude=${longitude}&locale=${i18n.locale}`
}

const urlGetSupplierServicesOrders = (supplierId) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/getSupplierServicesOrders?supplierId=${supplierId}&locale=${i18n.locale}`
}
const urlUploadAvatar = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/uploadAvatar`
}

const urlUpdateSettings = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/updateSettings`
}
const urlInsertStadium = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/stadium/insertStadium`
}
const urlLoginFacebook = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/loginFacebook`
}
const urlGetOrdersBySupplierId = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/orders/getOrdersBySupplierId`
}
const urlUpdateOrderStatus = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/orders/updateOrderStatus`
}

const urlInsertCustomerNotificationToken = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/token/insertCustomerNotificationToken`
}

const urlInsertSupplierNotificationToken = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/token/insertSupplierNotificationToken`
}
const urlInsertNewChat = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/chat/insertNewChat`
}


const urlGetNotificationsBySupplierId = (supplierId) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/notifications/getNotificationsBySupplierId?supplierId=${supplierId}&locale=${i18n.locale}`
}
const urlGetNotificationsByCustomerId = (customerId) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/notifications/getNotificationsByCustomerId?customerId=${customerId}&locale=${i18n.locale}`
}

module.exports = {
    urlLoginSupplier
}
