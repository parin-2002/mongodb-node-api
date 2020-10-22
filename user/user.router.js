const userRoute = require('express').Router()
const user = require('./user.schema')
const { userValidate, userUpdateValidate } = require('../validater/validate.middleware')
const nodemailer = require('nodemailer')
const { sign } = require('jsonwebtoken')
const { verifyEmail, verifyToken } = require('../auth/verify')
const os = require('os');
const bodyparser = require('body-parser')
const orderRouter = require('./order/order.router')

var urlencoded = bodyparser.urlencoded({ extended: false })

//router
userRoute.use('/order', orderRouter)

const netinter = os.networkInterfaces();
const ip = netinter["Wi-Fi"][3].address;
//console.log(ip)

//register user
userRoute.post('/', userValidate, async (req, res) => {
    const User = new user({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        gender: req.body.gender,
        email: req.body.email,
        mobileno: req.body.mobileno,
        password: req.body.password
    })
    try {
        const jsontoken = sign({ result: { email: req.body.email } }, process.env.key, { expiresIn: '24h' })
        const result = await User.save()
        const verify = await sendEmail(req.body.email, jsontoken)
        return res.json({
            success: 1,
            mail: verify,
            result: result
        })
    } catch (err) {
        return res.json({
            success: 0,
            message: err.message
        })
    }
})

//login user
userRoute.post('/login', async (req, res) => {
    try {
        const result = await user.findOne({ email: req.body.email, password: req.body.password })
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
userRoute.put('/update/:id', verifyToken, userUpdateValidate, async (req, res) => {
    try {
        await user.findOneAndUpdate(req.params.id, req.body)
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

//resend verification email
userRoute.post('/verifyagain', async (req, res) => {
    const User = await user.findOne({ email: req.body.email });
    if (User) {
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

//forgoat password
userRoute.post('/forgot', async (req, res) => {
    const User = await user.findOne({ email: req.body.email })
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

//sended link in mail using this link you can update your detail see two route in down
//send form to reset password
userRoute.get('/form', async (req, res) => {
    res.setHeader('Contant-Type', 'text/html')
    res.sendFile('C:/Users/Parin.LAPTOP-CH1ANDCS/Desktop/bob/mongoapi/user/resetpassword.html')
})

//update password
userRoute.post('/updatepassword', urlencoded, async (req, res) => {
    //console.log(req.body.email, req.body.password, req.body.cpassword)
    try {
        const User = await user.findOne({ email: req.body.email })
        if (User) {
            await user.findOneAndUpdate({ email: req.body.email }, { password: req.body.password })
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
            link http://${ip}:3000/user/form`
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

//verify user
userRoute.get('/verify/:token', verifyEmail, async (req, res) => {
    //console.log(req.decoded)
    const email = req.decoded;
    const User = await user.findOne({ email: email });
    User.verify = true;
    try {
        await User.save();
        res.send("<h1>Email verifyed!</h1>");
    }
    catch (err) {
        console.error(err);
        res.send("<h1>error</h1>")
    }
})

//cotact to company
userRoute.post('/contact', (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'parinsuvagiya2002@gmail.com',
            pass: '2002@#@parin'
        }
    });

    var mailOptions = {
        from: 'parinsuvagiya2002@gmail.com',
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return res.json({ message: "mail not sended try again" })
        } else {
            return res.json({ message: "mail sended successfully" })
        }
    });
})

//send verification email
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
            text: `http://${ip}:3000/user/verify/${jsontoken}`
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

module.exports = userRoute