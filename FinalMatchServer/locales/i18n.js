i18n = require("i18n")
i18n.configure({
    locales:['en', 'vi'],
    defaultLocale: 'de',
    directory: './locales'
})
debugger
module.exports = {
    i18n
}
