const GoogleAPIKey = 'AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0'
// const SERVER_NAME = '192.168.1.149'
const SERVER_NAME = '192.168.1.88'
const SERVER_PORT = '3000'
export const urlGetAddressFromLatLong = (latitude, longitude) => {
    return `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${GoogleAPIKey}`
}
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

export const urlGetSupplierById = (supplierId) => {
    return `http://${SERVER_NAME}:${SERVER_PORT}/suppliers/urlGetSupplierById?supplierId=${supplierId}`
}
export const urlCheckPlayerServiceExist = (supplierId) => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/playerServices/checkPlayerServiceExist?supplierId=${supplierId}`
}
export const urlTokenCheck = () => {    
    return `http://${SERVER_NAME}:${SERVER_PORT}/token/tokenCheck`
}


