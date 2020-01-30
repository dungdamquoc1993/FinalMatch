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