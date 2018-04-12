const express = require('express')
const bodyParser = require('body-parser')
const app = require('easily-handle-error')(express())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/media')

app.get('/keywords', require('./handlers/getDate'))

app.use((err, req, res, next) => {
    console.dir(err)
})

app.listen(7001)