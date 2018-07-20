const mongoose = require('mongoose')
const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@sda-bwjq3.mongodb.net/${process.env.DB_NAME}?retryWrites=true`

mongoose.connect(dbUrl, {useNewUrlParser: true})
module.exports = {mongoose}