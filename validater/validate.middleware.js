const { user, update, seller, sellerupdate, product, order } = require('./validate.schema')

async function userValidate(req, res, next) {
    const value = await user.validate(req.body)
    if (value.error) {
        return res.json({
            success: 0,
            message: value.error.details[0].message
        })
    } else {
        next()
    }
}

async function userUpdateValidate(req, res, next) {
    const value = await update.validate(req.body)
    if (value.error) {
        return res.json({
            success: 0,
            message: value.error.details[0].message
        })
    } else {
        next()
    }
}

async function sellerValidate(req, res, next) {
    const value = await seller.validate(req.body)
    if (value.error) {
        return res.json({
            success: 0,
            message: value.error.details[0].message
        })
    } else {
        next()
    }
}

async function sellerUpdate(req, res, next) {
    const value = await sellerupdate.validate(req.body)
    if (value.error) {
        return res.json({
            success: 0,
            message: value.error.details[0].message
        })
    } else {
        next()
    }
}

async function productUpdateValidate(req, res, next) {
    const value = await product.validate(req.body)
    if (value.error) {
        return res.json({
            success: 0,
            message: value.error.details[0].message
        })
    } else {
        next()
    }
}

async function orderValidate(req, res, next) {
    const value = await order.validate(req.body)
    if (value.error) {
        return res.json({
            success: 0,
            message: value.error.details[0].message
        })
    } else {
        next()
    }
}

module.exports = { userValidate, userUpdateValidate, sellerValidate, sellerUpdate, productUpdateValidate, orderValidate }