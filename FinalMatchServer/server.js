const express = require('express')
const {i18n} = require('./locales/i18n')
const app = express()
app.use(i18n.init);
module.exports = {
    app
}
