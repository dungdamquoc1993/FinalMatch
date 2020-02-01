export const validateEmail = (email) => {
    const  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return email.match(mailformat)
}
export const validatePasword = (password) => {    
    return password.length > 1
}

