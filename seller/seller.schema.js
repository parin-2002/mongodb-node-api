const mongoose = require('mongoose')

const seller = mongoose.Schema({
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
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: 'seller'
    },
    verify: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model('seller', seller)