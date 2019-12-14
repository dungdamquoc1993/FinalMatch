const GoogleAPIKey = 'AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0'
const SERVER_NAME = '192.168.1.149'
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