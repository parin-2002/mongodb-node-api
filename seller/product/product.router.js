const express = require('express')
const productRouter = express.Router()
const { verifyToken } = require('../../auth/verify')
const product = require('./product.schema')
const multer = require('multer')
const path = require('path')
const { productUpdateValidate } = require('../../validater/validate.middleware')

const storage = multer.diskStorage({
    destination: './seller/productimg',
    filename: (req, file, callback) => {
        return callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })

//add product
productRouter.use('/productimg', express.static(path.join(__dirname, "..", '/productimg')))
productRouter.post('/', verifyToken, upload.array('files'), async (req, res) => {
    if (!req.files) {
        return res.json({
            message: "file requird"
        })
    }
    else {
        //console.log(req.files.length)
        let imgarr = []
        for (img in req.files) {
            // console.log(req.files[img].filename)
            imgarr.push(`http://localhost:3000/seller/product/productimg/${req.files[img].filename}`)
        }
        const Product = new product({
            email: req.body.email,
            img: imgarr,
            ptitle: req.body.ptitle,
            price: req.body.price,
            pdetail: req.body.pdetail,
            sellerid: req.body.sellerid
        })
        try {
            const result = await Product.save()
            //console.log(result.pdetail)
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
    }
})

//update product
productRouter.put('/update/:id', verifyToken, productUpdateValidate, async (req, res) => {
    try {
        await product.findByIdAndUpdate(req.params.id, req.body)
        return res.json({
            message: "updated successfully"
        })
    } catch (err) {
        return res.json({
            success: 0,
            message: err.message
        })
    }
})

//delete product
productRouter.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        await product.findByIdAndDelete(req.params.id)
        return res.json({
            success: 1,
            message: "deleted successfully"
        })
    } catch (err) {
        return res.json({
            success: 0,
            message: err.message
        })
    }
})

module.exports = productRouter