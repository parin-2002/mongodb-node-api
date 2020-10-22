const mongoose = require('mongoose')

const product = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    img: {
        type: [],
        required: true
    },
    ptitle: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    pdetail: {
        type: Object,
        required: true,

    },
    sellerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seller",
        required: true
    }
})

module.exports = mongoose.model('product', product)