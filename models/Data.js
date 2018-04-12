const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    date: String,
    data: Array
})
module.exports = mongoose.model('Data', schema)