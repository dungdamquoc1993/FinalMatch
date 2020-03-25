i18n = require("i18n")
i18n.configure({
    locales:['en', 'vi'],
    defaultLocale: 'en',
    directory: './locales'
})
debugger
module.exports = {
    i18n
}
