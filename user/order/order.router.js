const order = require('./order.schema')
const orderRouter = require('express').Router()
const { verifyToken } = require('../../auth/verify')
const { orderValidate } = require('../../validater/validate.middleware')
const product = require('../../seller/product/product.schema')
const doneorder = require('./doneorder.schema')
const returnorder = require('./return.schema')

//add order
orderRouter.post('/', verifyToken, orderValidate, async (req, res) => {
    const Order = new order({
        userid: req.body.userid,
        productid: req.body.productid,
        sellerid: req.body.sellerid,
        fullname: req.body.fullname,
        email: req.body.email,
        mobileno: req.body.mobileno,
        city: req.body.city,
        pincode: req.body.pincode,
        address: req.body.address,
        otherdetail: req.body.otherdetail
    })
    try {
        const result = await Order.save()
        return res.json({
            success: 1,
            result: result
        })
    } catch (err) {
        return res.json({
            success: 0,
            message: err.message
        })
    }
})

//user orders display
orderRouter.get('/userorder/:id', verifyToken, async (req, res) => {
    try {
        let result = []
        const orderdata = await order.find({ userid: req.params.id })
        if (orderdata.length == 1) {
            const productdata = await product.findOne(orderdata.productid)
            result.push({
                orderdata: orderdata,
                productdata: productdata
            })
        } else if (orderdata.length > 1) {
            for (data of orderdata) {
                const productdata = await product.findOne(data.productid)
                result.push({
                    orderdata: data,
                    productdata: productdata
                })
            }
        }
        return res.json({
            success: 1,
            result: result
        })
    } catch (err) {
        return res.json({
            success: 0,
            message: err.message
        })
    }
})

//seller order display
orderRouter.get('/sellerorder/:id', verifyToken, async (req, res) => {
    try {
        let result = []
        const orderdata = await order.find({ sellerid: req.params.id })
        if (orderdata.length == 1) {
            const productdata = await product.findOne(orderdata.productid)
            result.push({
                orderdata: orderdata,
                productdata: productdata
            })
        } else if (orderdata.length > 1) {
            for (data of orderdata) {
                const productdata = await product.findOne(data.productid)
                result.push({
                    orderdata: data,
                    productdata: productdata
                })
            }
        }
        return res.json({
            success: 1,
            result: result
        })
    } catch (err) {
        return res.json({
            success: 0,
            message: err.message
        })
    }
})

//return order
orderRouter.post('/return/:id', verifyToken, async (req, res) => {
    try {
        const Returnorder = new returnorder({
            userid: req.body.userid,
            productid: req.body.productid,
            sellerid: req.body.sellerid,
            fullname: req.body.fullname,
            email: req.body.email,
            mobileno: req.body.mobileno,
            city: req.body.city,
            pincode: req.body.pincode,
            address: req.body.address,
            otherdetail: req.body.otherdetail
        })
        const result = await Returnorder.save()
        await order.findByIdAndDelete(req.params.id)
        return res.json({
            success: 1,
            result: result
        })
    } catch (err) {
        return res.json({
            success: 0,
            message: err.message
        })
    }
})

//order complate
orderRouter.post('/orderdone/:id', verifyToken, async (req, res) => {
    try {
        const Doneorder = new doneorder({
            userid: req.body.userid,
            productid: req.body.productid,
            sellerid: req.body.sellerid,
            fullname: req.body.fullname,
            email: req.body.email,
            mobileno: req.body.mobileno,
            city: req.body.city,
            pincode: req.body.pincode,
            address: req.body.address,
            otherdetail: req.body.otherdetail
        })
        const result = await Doneorder.save()
        await order.findByIdAndDelete(req.params.id)
        return res.json({
            success: 1,
            result: result
        })
    } catch (err) {
        return res.json({
            success: 0,
            message: err.message
        })
    }
})

module.exports = orderRouter
