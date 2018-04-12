const express = require('express')
const bodyParser = require('body-parser')
const app = require('easily-handle-error')(express())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/media')

app.get('/keyboard', require('./handlers/getButtons'))
app.post('/message', require('./handlers/getMessage'))

app.use((err, req, res, next) => {
    console.dir(err)
})
console.log('restart')
app.listen(7001)