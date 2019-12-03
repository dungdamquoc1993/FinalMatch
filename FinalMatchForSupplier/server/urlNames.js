const GoogleAPIKey = 'AIzaSyBrpg01q7yGyZK7acZuTRUw-HIrtFT-Zu0'
export const urlGetAddressFromLatLong = (latitude, longitude) => {
    return `https://maps.googleapis.com/maps/api/geocode/json?address=${latitude},${longitude}&key=${GoogleAPIKey}`
}
