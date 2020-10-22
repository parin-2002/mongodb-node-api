const { string } = require('@hapi/joi')
const mongoose = require('mongoose')

const user = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileno: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: 'user'
    },
    verify: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model('user', user)