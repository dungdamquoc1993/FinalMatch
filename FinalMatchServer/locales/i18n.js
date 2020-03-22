i18n = require("i18n")
i18n.configure({
    locales:['en', 'vi'],
    directory: __dirname + '/locales'
})
module.exports = {
    i18n
}