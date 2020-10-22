const mongoose = require('mongoose')

const doneorder = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
    },
    productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    sellerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seller",
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileno: {
        type: Number,
        required: true
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
    otherdetail: {
        type: Object,
        required: true
    }
})

module.exports = mongoose.model('doneorder', doneorder)