const sellerRouter = require('express').Router()
const seller = require('./seller.schema')
const os = require('os')
const { sellerValidate, sellerUpdate } = require('../validater/validate.middleware')
const { sign } = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const { verifyEmail, verifyToken } = require('../auth/verify')
const bodyparser = require('body-parser')
const productRouter = require('./product/product.router')

//router
sellerRouter.use('/product', productRouter)

var urlencoded = bodyparser.urlencoded({ extended: false })

const netinter = os.networkInterfaces();
const ip = netinter["Wi-Fi"][3].address;

//register seller
sellerRouter.post('/', sellerValidate, async (req, res) => {
    const Seller = new seller({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        gender: req.body.gender,
        email: req.body.email,
        mobileno: req.body.mobileno,
        city: req.body.city,
        pincode: req.body.pincode,
        address: req.body.address,
        password: req.body.password
    })
    try {
        const jsontoken = sign({ result: { email: req.body.email } }, process.env.key, { expiresIn: '24h' })
        const result = await Seller.save()
        const verify = await sendEmail(req.body.email, jsontoken)
        return res.json({
            success: 1,
            mail: verify,
            result: result
        })
    }
    catch (err) {
        return res.json({
            success: 0,
            message: err.message
        })
    }
})

//login seller
sellerRouter.post('/login', async (req, res) => {
    try {
        const result = await seller.findOne({ email: req.body.email, password: req.body.password })
        result.password = undefined
        const jsontoken = sign({ result: result }, process.env.key, {})
        return res.json({
            success: 1,
            token: jsontoken,
            result: result
        })
    } catch (err) {
        return res.json({
            success: 0,
            message: err.message
        })
    }
})

//update user
sellerRouter.put('/update/:id', verifyToken, sellerUpdate, async (req, res) => {
    try {
        await seller.findOneAndUpdate(req.params.id, req.body)
        res.json({
            success: 1,
            message: "updated successfully"
        })
    } catch (err) {
        return res.json({
            success: 0,
            message: err.message
        })
    }
})

//verify seller
sellerRouter.get('/verify/:token', verifyEmail, async (req, res) => {
    //console.log(req.decoded)
    const email = req.decoded;
    const Seller = await seller.findOne({ email: email });
    Seller.verify = true;
    try {
        await Seller.save();
        res.send("<h1>Email verifyed!</h1>");
    }
    catch (err) {
        console.error(err);
        res.send("<h1>error</h1>")
    }
})

//resend verification email
sellerRouter.post('/verifyagain', async (req, res) => {
    const Seller = await seller.findOne({ email: req.body.email });
    if (Seller) {
        const jsontoken = sign({ result: { email: req.body.email } }, process.env.key, { expiresIn: '24h' })
        const result = await sendEmail(req.body.email, jsontoken)
        return res.json({
            message: result
        })
    } else {
        return res.json({
            message: "email not register"
        })
    }
})

//send verification Email
function sendEmail(email, jsontoken) {
    return new Promise((resolve, reject) => {
        // console.log(jsontoken)
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'parinsuvagiya2002@gmail.com',
                pass: '2002@#@parin'
            }
        });

        var mailOptions = {
            from: 'parinsuvagiya2002@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            text: `http://${ip}:3000/seller/verify/${jsontoken}`
        };
        console.log(mailOptions.text);
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return reject("mail not send");
            } else {
                return resolve("mail sucessfully sended");
            }
        });
    });
}

//forgot password
sellerRouter.post('/forgot', async (req, res) => {
    const User = await seller.findOne({ email: req.body.email })
    if (User) {
        const result = await sendResetPasswordEmail(req.body.email)
        return res.json({
            success: 1,
            result: result
        })
    }
    else {
        return res.json({
            success: 0,
            message: "email not register"
        })
    }
})

//password reset email send
function sendResetPasswordEmail(email) {
    return new Promise((resolve, reject) => {
        // console.log(jsontoken)
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'parinsuvagiya2002@gmail.com',
                pass: '2002@#@parin'
            }
        });

        var mailOptions = {
            from: 'parinsuvagiya2002@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            text: `reset to password click this 
            link http://${ip}:3000/seller/form`
        };
        //console.log(mailOptions.text);
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return reject("mail not send");
            } else {
                return resolve("mail sucessfully sended");
            }
        });
    });
}

//sended link in mail using this link you can update your detail see two route in down
//send form to reset password
sellerRouter.get('/form', async (req, res) => {
    res.setHeader('Contant-Type', 'text/html')
    res.sendFile('C:/Users/Parin.LAPTOP-CH1ANDCS/Desktop/bob/mongoapi/seller/resetpassword.html')
})

//update password
sellerRouter.post('/updatepassword', urlencoded, async (req, res) => {
    //console.log(req.body.email, req.body.password, req.body.cpassword)
    try {
        const Seller = await seller.findOne({ email: req.body.email })
        if (Seller) {
            await seller.findOneAndUpdate({ email: req.body.email }, { password: req.body.password })
            return res.json({
                message: "password updated"
            })
        } else {
            return res.json({ message: 'Email not register check your email' })
        }
    } catch (err) {
        return res.json({ message: err.message })
    }
})

//delete seller account
sellerRouter.delete('/delete', async (req, res) => {
    try {
        await seller.findOneAndDelete({ email: req.body.email })
        return res.json({
            success: 1,
            message: 'deleted successfully'
        })
    } catch (err) {
        return res.json({
            success: 0,
            message: err.message
        })
    }
})

module.exports = sellerRouter