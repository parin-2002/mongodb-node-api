const joi = require('@hapi/joi')

const schema = {
    user: joi.object({
        firstname: joi.string().max(20).required(),
        lastname: joi.string().max(20).required(),
        gender: joi.string().valid('male', 'female', 'other').required(),
        email: joi.string().required(),
        mobileno: joi.number().integer().min(1000000000).message('invalid mobileno').max(9999999999).message('invalid mobileno').required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9@#$%&!]{8,30}$')).required()
    }),
    update: joi.object({
        firstname: joi.string().max(20),
        lastname: joi.string().max(20),
        gender: joi.string().valid('male', 'female', 'other'),
        mobileno: joi.number().integer().min(1000000000).message('invalid mobileno').max(9999999999).message('invalid mobileno'),
    }),
    seller: joi.object({
        firstname: joi.string().max(20).required(),
        lastname: joi.string().max(20).required(),
        gender: joi.string().valid('male', 'female', 'other').required(),
        email: joi.string().required(),
        mobileno: joi.number().integer().min(1000000000).message('invalid mobileno').max(9999999999).message('invalid mobileno').required(),
        city: joi.string().required(),
        pincode: joi.number().required(),
        address: joi.string().min(20).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9@#$%&!]{8,30}$')).required()
    }),
    sellerupdate: joi.object({
        firstname: joi.string().max(20),
        lastname: joi.string().max(20),
        gender: joi.string().valid('male', 'female', 'other'),
        mobileno: joi.number().integer().min(1000000000).message('invalid mobileno').max(9999999999).message('invalid mobileno'),
        address: joi.string().min(20),
    }),
    product: joi.object({
        ptitle: joi.string(),
        price: joi.number(),
        pdetail: joi.object()
    }),
    order: joi.object({
        userid: joi.string().required(),
        productid: joi.string().required(),
        sellerid: joi.string().required(),
        fullname: joi.string().required(),
        email: joi.string().required(),
        mobileno: joi.number().required(),
        city: joi.string().required(),
        pincode: joi.number().required(),
        address: joi.string().required(),
        otherdetail: joi.object().required()
    })
}

module.exports = schema