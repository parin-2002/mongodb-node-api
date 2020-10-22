require('dotenv').config()
const express = require('express')
const app = express()
const userRoute = require('./user/user.router')
const mongoose = require('mongoose')
const sellerRouter = require('./seller/seller.router')

//mongodb connection
mongoose.connect(process.env.dburl,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connection Success'))

//allways called middleware
app.use(express.json())

//router
app.use('/user', userRoute)
app.use('/seller', sellerRouter)

app.get('/', (err, res) => {
    res.json({
        success: 1,
        message: 'api working'
    })
})

app.listen(process.env.port, () => {
    console.log('server run....')
})